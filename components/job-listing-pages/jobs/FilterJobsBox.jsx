"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

// filters
import {
  addCategory,
  addDatePosted,
  addDestination,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
  addTag,
} from "@/store/slices/filterSlice";

// jobs list
import { fetchPublicJobs } from "@/store/slices/publicJobsSlice";
import { fetchMyApplications } from "@/store/slices/jobsSlice";

// shortlist
import {
  loadShortlist,
  addToShortlist,
  removeFromShortlist,
} from "@/store/slices/shortlistSlice";

// cleaner
import { getCleanerMe } from "@/services/cleanerService";

// fallback SVG
const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='50' height='49'>
       <rect width='100%' height='100%' rx='8' ry='8' fill='#eef2ff'/>
       <text x='50%' y='55%' text-anchor='middle' font-size='20' fill='#6366f1'>🏢</text>
     </svg>`
  );

const FilterJobsBox = () => {
  // ===== filters =====
  const { jobList, jobSort } = useSelector((state) => state.filter) || {};
  const {
    keyword,
    location,
    destination,
    category,
    jobType,
    datePosted,
    experience,
    salary,
    tag,
  } = jobList || {};
  const { sort, perPage } = jobSort || {};

  // ===== jobs slice =====
  const { list, loading, error } = useSelector((s) => s.publicJobs) || {};
  
  // ===== applications from jobsSlice =====
  const { myApplications, applicationsLoading } = useSelector((s) => s.jobs) || {};

  // ===== auth (robust) =====
  const auth = useSelector((s) => s.auth) || {};
  const authUser = auth.user || auth.authUser || null;

  const isLoggedIn =
    Boolean(auth?.isLoggedIn) ||
    Boolean(auth?.isAuthenticated) ||
    Boolean(authUser) ||
    Boolean(auth?.tokens?.access);

  const isCleaner =
    Boolean(authUser?.is_cleaner) ||
    authUser?.role === "cleaner" ||
    Boolean(authUser?.cleaner_profile) ||
    Boolean(authUser?.isCleaner);

  // ===== shortlist slice =====
  const shortlistState = useSelector((s) => s.shortlist) || {};
  const shortlistItems = Array.isArray(shortlistState.items)
    ? shortlistState.items
    : [];

  // ===== local cleanerPk cache =====
  const [cleanerPk, setCleanerPk] = useState(null);
  const [cleanerLoaded, setCleanerLoaded] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // ===== build fetch params =====
  const params = useMemo(
    () => ({
      keyword,
      location,
      destination,
      category,
      datePosted,
      salary,
      sort,
      perPage,
    }),
    [keyword, location, destination, category, datePosted, salary, sort, perPage]
  );

  // ---- initial jobs fetch (once) ----
  const loadedOnceRef = useRef(false);
  useEffect(() => {
    if (loadedOnceRef.current) return;
    loadedOnceRef.current = true;
    dispatch(fetchPublicJobs(params));
  }, [dispatch]);

  // ---- Load applications for logged-in cleaners ----
  useEffect(() => {
    if (isLoggedIn && isCleaner) {
      dispatch(fetchMyApplications());
    }
  }, [isLoggedIn, isCleaner, dispatch]);

  // ---- top search submit ----
  useEffect(() => {
    const handler = () => dispatch(fetchPublicJobs(params));
    document.addEventListener("public-jobs:search", handler);
    return () => document.removeEventListener("public-jobs:search", handler);
  }, [dispatch, params]);

  // ---- auto fetch when datePosted/salary/sort/perPage change ----
  const autoKey = useMemo(
    () => JSON.stringify({ datePosted, salary, sort, perPage }),
    [datePosted, salary, sort, perPage]
  );
  const prevAutoKey = useRef(null);
  useEffect(() => {
    if (!loadedOnceRef.current) return;
    if (prevAutoKey.current === autoKey) return;
    prevAutoKey.current = autoKey;
    dispatch(fetchPublicJobs(params));
  }, [autoKey, dispatch, params]);

  // ---- load shortlist once for cleaners ----
  useEffect(() => {
    if (isLoggedIn && isCleaner) {
      dispatch(loadShortlist());
    }
  }, [dispatch, isLoggedIn, isCleaner]);

  // ---- load cleanerPk once ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isLoggedIn || !isCleaner || cleanerLoaded) return;
      try {
        const { data } = await getCleanerMe();
        const pk = data?.id ?? data?.pk ?? null;
        if (mounted) setCleanerPk(pk);
      } catch {
        if (mounted) setCleanerPk(null);
      } finally {
        if (mounted) setCleanerLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn, isCleaner, cleanerLoaded]);

  // ---- Check if filters are default ----
  const hasActiveFilters = useMemo(() => {
    const hasKeyword = !!(keyword && keyword.trim());
    const hasLocation = !!(location && location.trim());
    const hasCategory = !!category;
    const hasDatePosted = !!datePosted && datePosted !== "all";
    const hasSalary = !!salary && (salary.min != 10 || salary.max != 30);
    const hasSort = !!sort;
    const hasPerPage =
      perPage && (Number(perPage.start) > 0 || Number(perPage.end) > 0);

    return (
      hasKeyword ||
      hasLocation ||
      hasCategory ||
      hasDatePosted ||
      hasSalary ||
      hasSort ||
      hasPerPage
    );
  }, [keyword, location, category, datePosted, salary, sort, perPage]);

  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(addDatePosted("all"));
    dispatch(addSalary({ min: 10, max: 30 }));
    dispatch(addTag(""));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));

    dispatch(fetchPublicJobs({
      keyword: "",
      location: "",
      destination: { min: 0, max: 100 },
      category: "",
      jobType: [],
      datePosted: "",
      experience: [],
      salary: { min: 10, max: 30 },
      tag: "",
      sort: "",
      perPage: { start: 0, end: 0 },
    }));
  };

  const sortHandler = (e) => dispatch(addSort(e.target.value));
  const perPageHandler = (e) => dispatch(addPerPage(JSON.parse(e.target.value)));

  // Function to handle job selection - STORE IN LOCALSTORAGE
  const handleJobClick = (job) => {
    // Store the complete job data in localStorage
    localStorage.setItem('selectedJob', JSON.stringify(job));
    // Navigate to detail page
    const jobId = job?.id ?? job?.job_id;
    router.push(`/job-single-v1/${jobId}`);
  };

  // ---- Job Card ----
  const JobCard = ({ job }) => {
    const jobId = Number(job?.id ?? job?.job_id ?? NaN);
    const jobIdString = String(job?.id ?? job?.job_id ?? '');
    const title = job?.title || job?.name || "Untitled Job";
    
    // Check if this job has been applied to
    const hasApplied = myApplications.some(app => 
      String(app.job) === jobIdString
    );

    const logo =
      job?.employer?.company_logo || job?.company_logo || job?.logo_url || "";

    const city =
      job?.city || job?.location_city || job?.location || job?.address_city || "";
    const country = job?.country || job?.location_country || "";
    const locationText = [city, country].filter(Boolean).join(", ") || "—";

    const rawDate =
      job?.date || job?.shift_date || job?.created_at || job?.updated_at || null;
    const rawTime = job?.time || job?.shift_time || job?.schedule || "";
    const dateLabel = (() => {
      if (!rawDate) return "—";
      const d = new Date(rawDate);
      return isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    })();
    const timeLabel = rawTime || "";

    const hours = job?.hours || job?.estimated_hours || job?.total_hours || null;
    const rate = job?.hourly_rate || job?.rate_per_hour || job?.price_per_hour || null;
    const salaryLabel =
      (rate ? `£${Number(rate)} / hr` : "—") + (hours ? ` • ${Number(hours)} hrs` : "");

    // derive shortlisted from slice
    const shortlistRow = Array.isArray(shortlistItems)
      ? shortlistItems.find((it) => Number(it.job?.id ?? it.job) === jobId)
      : null;
    const shortlisted = !!shortlistRow;

    const onApply = () => {
      if (!jobId || Number.isNaN(jobId)) return;
      // Store job data before navigating
      localStorage.setItem('selectedJob', JSON.stringify(job));
      
      if (!isLoggedIn) return router.push(`/login?next=/job-single-v1/${jobId}`);
      if (!isCleaner) return;
      
      // If already applied, just navigate to view
      if (hasApplied) {
        router.push(`/job-single-v1/${jobId}`);
      } else {
        router.push(`/job-single-v1/${jobId}?apply=1`);
      }
    };

    // Fetch cleaner pk on-demand if missing
    const ensureCleanerPk = async () => {
      if (cleanerPk) return cleanerPk;
      if (!isLoggedIn || !isCleaner) return null;
      try {
        const { data } = await getCleanerMe();
        const pk = data?.id ?? data?.pk ?? null;
        if (pk != null) setCleanerPk(pk);
        return pk;
      } catch (e) {
        return null;
      }
    };

    const onToggleShortlist = async () => {
      if (!jobId || Number.isNaN(jobId)) {
        return;
      }
      if (!isLoggedIn) {
        return router.push(`/login?next=/jobs/${jobId}`);
      }
      if (!isCleaner) {
        return;
      }

      try {
        if (shortlisted) {
          let rowId = shortlistRow?.id || null;
          if (!rowId) {
            const latest = await dispatch(loadShortlist()).unwrap();
            const row = Array.isArray(latest)
              ? latest.find((it) => Number(it.job?.id ?? it.job) === jobId)
              : null;
            rowId = row?.id || null;
          }
          if (!rowId) {
            return;
          }
          await dispatch(removeFromShortlist({ id: rowId })).unwrap();
          await dispatch(loadShortlist()).unwrap();
        } else {
          const cid = await ensureCleanerPk();
          if (!cid) {
            return;
          }
          const payload = { job: jobId, cleaner: Number(cid) };
          await dispatch(addToShortlist(payload)).unwrap();
          await dispatch(loadShortlist()).unwrap();
        }
      } catch (err) {
        console.error("[shortlist] add/remove failed:", err);
      }
    };

    return (
      <div className="job-block" key={jobId || title}>
        <div className="inner-box d-flex justify-content-between align-items-center">
          {/* LEFT */}
          <div className="content">
            <span className="company-logo">
              {logo ? (
                <img
                  width={50}
                  height={49}
                  src={logo}
                  alt="company"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_SVG;
                  }}
                />
              ) : (
                <Image width={50} height={49} src={FALLBACK_SVG} alt="fallback" />
              )}
            </span>

            <h4>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleJobClick(job);
                }}
              >
                {title}
              </a>
              {hasApplied && (
                <span 
                  className="badge ms-2" 
                  style={{ 
                    backgroundColor: '#10b981', 
                    color: '#fff',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Applied ✓
                </span>
              )}
            </h4>

            <ul className="job-info">
              <li>
                <span className="icon flaticon-map-locator"></span>
                {locationText}
              </li>
              <li>
                <span className="icon flaticon-calendar"></span> {dateLabel}
              </li>
              {timeLabel ? (
                <li>
                  <span className="icon flaticon-clock-3"></span> {timeLabel}
                </li>
              ) : null}
              <li>
                <span className="icon flaticon-money"></span> {salaryLabel}
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div className="d-flex flex-column align-items-end ms-3" style={{ gap: 12 }}>
            <ul className="option-list mb-0">
              <li>
                <button
                  type="button"
                  onClick={onToggleShortlist}
                  data-text={shortlisted ? "Shortlisted" : "Shortlist"}
                  className={shortlisted ? "active" : ""}
                  aria-pressed={shortlisted}
                >
                  <span
                    className={shortlisted ? "la la-bookmark" : "la la-bookmark-o"}
                    style={shortlisted ? { color: "#ef4444" } : undefined}
                  ></span>
                </button>
              </li>
            </ul>

            <button
              type="button"
              onClick={onApply}
              className="theme-btn btn-style-one"
              style={{ 
                minWidth: 140,
                ...(hasApplied ? { 
                  backgroundColor: '#10b981', 
                  borderColor: '#10b981' 
                } : {})
              }}
              disabled={applicationsLoading}
            >
              {hasApplied ? "View Applied Job" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const content =
    Array.isArray(list?.results) && list.results.length ? (
      list.results.map((job, idx) => (
        <JobCard key={job?.id ?? job?.job_id ?? `job-${idx}`} job={job} />
      ))
    ) : !loading && !error ? (
      <p className="mt-3">No jobs found.</p>
    ) : null;

  return (
    <>
      <div className="ls-switcher">
        <div className="show-result">
          <div className="show-1023">
            <button
              type="button"
              className="theme-btn toggle-filters "
              data-bs-toggle="offcanvas"
              data-bs-target="#filter-sidebar"
            >
              <span className="icon icon-filter"></span> Filter
            </button>
          </div>

          <div className="text">
            {loading ? (
              "Loading jobs…"
            ) : error ? (
              <span className="text-danger">{String(error)}</span>
            ) : (
              <>Show <strong>{list?.count || 0}</strong> jobs</>
            )}
          </div>
        </div>

        <div className="sort-by">
          {hasActiveFilters ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : null}

          <select value={sort || ""} className="chosen-single form-select" onChange={sortHandler}>
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage || { start: 0, end: 0 })}
          >
            <option value={JSON.stringify({ start: 0, end: 0 })}>All</option>
            <option value={JSON.stringify({ start: 0, end: 15 })}>15 per page</option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>20 per page</option>
            <option value={JSON.stringify({ start: 0, end: 30 })}>30 per page</option>
          </select>
        </div>
      </div>

      {content}

      <div className="ls-show-more">
        <p>
          {list?.count
            ? `Showing ${Math.min((list?.results?.length || 0), list.count)} of ${list.count} jobs`
            : "No more jobs"}
        </p>
        <div className="bar">
          <span
            className="bar-inner"
            style={{
              width:
                list?.count && list?.results?.length
                  ? `${Math.min(
                      100,
                      Math.round((list.results.length / list.count) * 100)
                    )}%`
                  : "0%",
            }}
          ></span>
        </div>

        <button
          className="show-more"
          disabled={!list?.next || loading}
          onClick={() => dispatch(fetchPublicJobs({ url: list.next }))}
        >
          {loading ? "Loading..." : list?.next ? "Show More" : "No More"}
        </button>
      </div>
    </>
  );
};

export default FilterJobsBox;
