'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";

import Categories from "../components/Categories";
import DestinationRangeSlider from "../components/DestinationRangeSlider";
// ❌ Removed CandidatesGender import on purpose
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";
import DatePosted from "../components/DatePosted";
import Experience from "../components/Experience";
import Qualification from "../components/Qualification";

import {
  addKeyword,
  addLocation,
  addDestination,
  addCategory,
  addDatePost,
  addPerPage,
  addSort,
  // keep your clear actions consistent with the rest of the page
  clearExperienceF,
  clearQualificationF,
} from "../../../features/filter/candidateFilterSlice";
import {
  clearDatePost,
  clearExperience,
  clearQualification,
} from "../../../features/candidate/candidateSlice";

/** Convert YYYY-MM-DD -> "mon-dd-yyyy" that your existing date filter matches against.
 * e.g. "2025-01-05" -> "jan-05-2025"
 */
const toMonKey = (isoDate) => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const mon = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][m - 1];
  return `${mon}-${String(d).padStart(2, "0")}-${y}`;
};

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Prime sidebar filters from URL (?service, ?location, ?date, ?time)
  useEffect(() => {
    const service = searchParams.get("service") || "";
    const location = searchParams.get("location") || "";
    const date = searchParams.get("date") || "";  // "YYYY-MM-DD"
    // const time = searchParams.get("time") || ""; // not used by current components

    if (service) dispatch(addKeyword(service));
    if (location) dispatch(addLocation(location));
    // Ensure we’re on the candidates vertical
    dispatch(addCategory("Cleaner"));
    // Keep your default radius
    dispatch(addDestination({ min: 0, max: 100 }));

    // Map URL date to the format your existing list filters against (created_at includes)
    if (date) {
      const monKey = toMonKey(date);
      if (monKey) dispatch(addDatePost(monKey));
    }
    // We don’t change per-page/sort here; those controls live in FilterTopBox
  }, [dispatch, searchParams]);

  // Optional “Reset All” that mirrors your top bar’s Clear All
  const onReset = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(addDatePost(""));
    dispatch(clearDatePost());
    dispatch(clearExperienceF());
    dispatch(clearExperience());
    dispatch(clearQualificationF());
    dispatch(clearQualification());
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  return (
    <div className="inner-column pd-right">
      <div className="filters-outer">
        <button
          type="button"
          className="btn-close text-reset close-filters show-1023"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>

        {/* Search by Keywords (WHAT) */}
        <div className="filter-block">
          <h4>Search by Keywords</h4>
          <div className="form-group">
            <SearchBox />
          </div>
        </div>

        {/* Location (WHERE) + radius */}
        <div className="filter-block">
          <h4>Location</h4>
          <div className="form-group">
            <LocationBox />
          </div>
          <p>Radius around selected destination</p>
          <DestinationRangeSlider />
        </div>

        {/* Category (kept) */}
        <div className="filter-block">
          <h4>Category</h4>
          <div className="form-group">
            <Categories />
          </div>
        </div>

        {/* ❌ Removed Candidate Gender block per your instruction */}

        {/* Date Posted (WHEN) – kept as-is, and we prefill from ?date */}
        <div className="checkbox-outer">
          <h4>Date Posted</h4>
          <DatePosted />
        </div>

        {/* Experience (kept) */}
        <div className="checkbox-outer">
          <h4>Experience</h4>
          <Experience />
        </div>

        {/* Qualification (kept) */}
        <div className="checkbox-outer">
          <h4>Qualification</h4>
          <Qualification />
        </div>

        {/* Bottom actions (keeps sidebar UX tight on mobile) */}
        <div className="filter-bottom-actions" style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button
            type="button"
            className="theme-btn btn-style-one"
            data-bs-dismiss="offcanvas"
            aria-label="Apply"
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={onReset}
            data-bs-dismiss="offcanvas"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
