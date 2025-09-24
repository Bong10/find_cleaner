'use client';

import FooterDefault from "../../footer/common-footer";
import Breadcrumb from "../../common/Breadcrumb";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";

import FilterTopBox from "./FilterTopBox";
import FilterSidebar from "./FilterSidebar";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addKeyword,
  addLocation,
  addCategory,
  addDestination,
  addCandidateGender,
  addDatePost,
  addSort,
  addPerPage,
} from "../../../features/filter/candidateFilterSlice";

/* -------------------------------------------
   Dummy Cambridge (UK) cleaners for cards
   ------------------------------------------- */
const cambridgeCleaners = [
  {
    id: 101,
    name: "Oliver Smith",
    designation: "Domestic Cleaner (Level 2)",
    location: "Cambridge, UK",
    hourlyRate: 19,
    gender: "male",
    category: "Cleaner",
    created_at: "jan-05-2025",
    destination: { min: 0, max: 100 },
    experience: "2-3 years",
    qualification: "NVQ Level 2",
    tags: ["Domestic", "Deep Clean", "Level 2", "★ 4.9"],
    avatar: "/images/resource/candidate-1.png",
  },
  {
    id: 102,
    name: "Amelia Brown",
    designation: "End-of-Tenancy Specialist (Level 3)",
    location: "Cambridge, UK",
    hourlyRate: 22,
    gender: "female",
    category: "Cleaner",
    created_at: "jan-08-2025",
    destination: { min: 0, max: 100 },
    experience: "3-5 years",
    qualification: "NVQ Level 3",
    tags: ["End-of-Tenancy", "Kitchens", "Level 3", "★ 5.0"],
    avatar: "/images/resource/candidate-2.png",
  },
  {
    id: 103,
    name: "Harry Wilson",
    designation: "Commercial Office Cleaner",
    location: "Cambridge, UK",
    hourlyRate: 21,
    gender: "male",
    category: "Cleaner",
    created_at: "jan-10-2025",
    destination: { min: 0, max: 100 },
    experience: "3-5 years",
    qualification: "NVQ Level 2",
    tags: ["Office", "After Hours", "Teams", "★ 4.8"],
    avatar: "/images/resource/candidate-3.png",
  },
  {
    id: 104,
    name: "Isla Thompson",
    designation: "Deep Cleaning Specialist",
    location: "Cambridge, UK",
    hourlyRate: 24,
    gender: "female",
    category: "Cleaner",
    created_at: "jan-12-2025",
    destination: { min: 0, max: 100 },
    experience: "5-7 years",
    qualification: "NVQ Level 3",
    tags: ["Deep Clean", "Limescale", "Bathrooms", "★ 4.9"],
    avatar: "/images/resource/candidate-4.png",
  },
  {
    id: 105,
    name: "Jack Taylor",
    designation: "Window & Carpet Cleaning",
    location: "Cambridge, UK",
    hourlyRate: 20,
    gender: "male",
    category: "Cleaner",
    created_at: "jan-15-2025",
    destination: { min: 0, max: 100 },
    experience: "2-3 years",
    qualification: "NVQ Level 2",
    tags: ["Windows", "Carpets", "Steam", "★ 4.7"],
    avatar: "/images/resource/candidate-5.png",
  },
  {
    id: 106,
    name: "Sophie Davies",
    designation: "Regular Domestic Cleaning",
    location: "Cambridge, UK",
    hourlyRate: 18,
    gender: "female",
    category: "Cleaner",
    created_at: "jan-16-2025",
    destination: { min: 0, max: 100 },
    experience: "1-2 years",
    qualification: "NVQ Level 2",
    tags: ["Weekly", "Bi-weekly", "Eco", "★ 4.6"],
    avatar: "/images/resource/candidate-6.png",
  },
  {
    id: 107,
    name: "George Evans",
    designation: "After-Party Cleaning",
    location: "Cambridge, UK",
    hourlyRate: 23,
    gender: "male",
    category: "Cleaner",
    created_at: "jan-18-2025",
    destination: { min: 0, max: 100 },
    experience: "3-5 years",
    qualification: "NVQ Level 2",
    tags: ["After-Party", "Odd Hours", "Rubbish Removal", "★ 4.8"],
    avatar: "/images/resource/candidate-7.png",
  },
  {
    id: 108,
    name: "Poppy Johnson",
    designation: "Biohazard Cleanup (Trained)",
    location: "Cambridge, UK",
    hourlyRate: 30,
    gender: "female",
    category: "Cleaner",
    created_at: "jan-20-2025",
    destination: { min: 0, max: 100 },
    experience: "5-7 years",
    qualification: "Biohazard Cert",
    tags: ["Biohazard", "PPE", "Insurance", "★ 5.0"],
    avatar: "/images/resource/candidate-8.png",
  },
  {
    id: 109,
    name: "Leo Carter",
    designation: "Move-in / Move-out",
    location: "Cambridge, UK",
    hourlyRate: 21,
    gender: "male",
    category: "Cleaner",
    created_at: "jan-22-2025",
    destination: { min: 0, max: 100 },
    experience: "3-5 years",
    qualification: "NVQ Level 2",
    tags: ["Move-in", "Move-out", "Team of 2", "★ 4.7"],
    avatar: "/images/resource/candidate-9.png",
  },
  {
    id: 110,
    name: "Freya Robinson",
    designation: "Regular Domestic Cleaning",
    location: "Cambridge, UK",
    hourlyRate: 19,
    gender: "female",
    category: "Cleaner",
    created_at: "jan-24-2025",
    destination: { min: 0, max: 100 },
    experience: "2-3 years",
    qualification: "NVQ Level 2",
    tags: ["Regular", "Eco", "Pets OK", "★ 4.8"],
    avatar: "/images/resource/candidate-10.png",
  },
];

const Index = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Redux filter state used by sidebar + topbar
  const {
    keyword,
    location,
    destination,
    category,
    candidateGender,
    datePost,
    experiences,
    qualifications,
    sort,
    perPage,
  } = useSelector((state) => state.candidateFilter) || {};

  /* ----------------------------------------------------
   * Prime sidebar filters from the query string
   * (sidebar remains the only search UI)
   * ---------------------------------------------------- */
  useEffect(() => {
    const service = searchParams.get("service") || "";
    const loc = searchParams.get("location") || "Cambridge, UK";
    if (service) dispatch(addKeyword(service));
    if (loc) dispatch(addLocation(loc));
    // sensible defaults for this page
    dispatch(addCategory("Cleaner"));
    dispatch(addDestination({ min: 0, max: 100 }));
  }, [dispatch, searchParams]);

  /* ----------------------------------------------------
   * Apply the same filter logic your UI expects
   * ---------------------------------------------------- */
  const keywordFilter = (item) =>
    keyword !== ""
      ? item?.name?.toLowerCase().includes(keyword?.toLowerCase()) && item
      : item;

  const locationFilter = (item) =>
    location !== ""
      ? item?.location?.toLowerCase().includes(location?.toLowerCase())
      : item;

  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  const genderFilter = (item) =>
    candidateGender !== ""
      ? item?.gender?.toLocaleLowerCase() ===
        candidateGender?.toLocaleLowerCase()
      : item;

  const datePostedFilter = (item) =>
    datePost !== "all" && datePost !== ""
      ? item?.created_at
          ?.toLocaleLowerCase()
          .split(" ")
          .join("-")
          .includes(datePost)
      : item;

  const experienceFilter = (item) =>
    experiences?.length !== 0
      ? experiences?.includes(
          item?.experience?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  const qualificationFilter = (item) =>
    qualifications?.length !== 0
      ? qualifications?.includes(
          item?.qualification?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  const sortFn = (a, b) => {
    if (sort === "des") return a.id > b.id ? -1 : 1; // newest first
    if (sort === "asc") return a.id < b.id ? -1 : 1; // oldest first
    return 0; // default
  };

  const visible = useMemo(
    () =>
      cambridgeCleaners
        ?.filter(keywordFilter)
        ?.filter(locationFilter)
        ?.filter(destinationFilter)
        ?.filter(categoryFilter)
        ?.filter(genderFilter)
        ?.filter(datePostedFilter)
        ?.filter(experienceFilter)
        ?.filter(qualificationFilter)
        ?.sort(sortFn)
        ?.slice(perPage?.start ?? 0, (perPage?.end ?? 0) === 0 ? undefined : perPage.end),
    [
      keyword,
      location,
      destination,
      category,
      candidateGender,
      datePost,
      experiences,
      qualifications,
      sort,
      perPage,
    ]
  );

  return (
    <>
      {/* Header Span */}
      <span className="header-span"></span>

      <LoginPopup />
      <DefaulHeader2 />
      <MobileMenu />

      <Breadcrumb title="Candidates" meta="Candidates" />

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            {/* Offcanvas for mobile/tablet filters */}
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filter-sidebar"
              aria-labelledby="offcanvasLabel"
            >
              <div className="filters-column hide-left">
                <FilterSidebar />
              </div>
            </div>

            {/* Static sidebar on desktop */}
            <div className="filters-column hidden-1023 col-lg-4 col-md-12 col-sm-12">
              <FilterSidebar />
            </div>

            {/* Content */}
            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="ls-outer">
                {/* Top bar: count / sort / per-page / clear (no cards inside) */}
                <FilterTopBox count={visible?.length || 0} />

                {/* Candidate cards — keep original template styles */}
                {visible?.map((c) => (
                  <div className="candidate-block-three" key={c.id}>
                    <div className="inner-box">
                      <div className="content">
                        <figure className="image">
                          <Image width={90} height={90} src={c.avatar} alt="candidate" />
                        </figure>

                        <h4 className="name">
                          <Link href={`/cleaner/${c.id}`}>{c.name}</Link>
                        </h4>

                        <ul className="candidate-info">
                          <li className="designation">{c.designation}</li>
                          <li>
                            <span className="icon flaticon-map-locator"></span> {c.location}
                          </li>
                          <li>
                            <span className="icon flaticon-money"></span> £{c.hourlyRate} / hour
                          </li>
                        </ul>

                        <ul className="post-tags">
                          {c.tags.map((t, i) => (
                            <li key={i}>
                              <a href="#">{t}</a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="btn-box">
                        <button className="bookmark-btn me-2" aria-label="Bookmark">
                          <span className="flaticon-bookmark"></span>
                        </button>

                        <Link
                          href={`/cleaner/${c.id}`}
                          className="theme-btn btn-style-three"
                        >
                          <span className="btn-title">View Profile</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {/* End cards */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterDefault />
    </>
  );
};

export default Index;
