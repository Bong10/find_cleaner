// components/candidates-listing-pages/candidates-list-v1/FilterTopBox.jsx
"use client";

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // same slice you already use
  addKeyword,
  addLocation,
  addDestination,
  addCategory,
  // addCandidateGender,
  // addDatePost,
  addExperience,
  // addQualification,
  addSort,
  addPerPage,
} from "@/store/slices/filterSlice";

/**
 * Props:
 *   count (number)   – how many items are currently visible (computed in index.jsx)
 */
const FilterTopBox = ({ count = 0 }) => {
  const dispatch = useDispatch();

  // read only what we need for the top bar UI
  const { jobList, jobSort } = useSelector((state) => state.filter) || {};
  const {
    keyword = "",
    location = "",
    destination = { min: 0, max: 100 },
    category = "",
    candidateGender = "",
    datePost = "",
    experiences = [],
    qualifications = [],
    talents = [],
    technologies = [],
  } = jobList || {};
  const { sort = "", perPage = { start: 0, end: 0 } } = jobSort || {};

  // show "Clear All" only when something is actually set
  const hasActiveFilters = useMemo(() => {
    return (
      (keyword && keyword.trim() !== "") ||
      (location && location.trim() !== "") ||
      Number(destination?.min) !== 0 ||
      Number(destination?.max) !== 100 ||
      category !== "" ||
      candidateGender !== "" ||
      (datePost && datePost !== "all" && datePost !== "") ||
      (Array.isArray(experiences) && experiences.length > 0) ||
      (Array.isArray(qualifications) && qualifications.length > 0) ||
      (Array.isArray(talents) && talents.length > 0) ||
      (Array.isArray(technologies) && technologies.length > 0) ||
      sort !== "" ||
      Number(perPage?.start) !== 0 ||
      Number(perPage?.end) !== 0
    );
  }, [
    keyword,
    location,
    destination,
    category,
    candidateGender,
    datePost,
    experiences,
    qualifications,
    talents,
    technologies,
    sort,
    perPage,
  ]);

  // handlers
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    // dispatch(addCandidateGender(""));
    // dispatch(addDatePost("all"));
    dispatch(addExperience([]));
    // dispatch(addQualification([]));
    dispatch(addTalents([]));
    dispatch(addTechnologies([]));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  const sortHandler = (e) => dispatch(addSort(e.target.value));
  const perPageHandler = (e) => dispatch(addPerPage(JSON.parse(e.target.value)));

  return (
    <>
      {/* Top filter bar box (design preserved) */}
      <div className="ls-switcher">
        <div className="show-result">
          {/* keep your offcanvas filter button */}
          <div className="show-1023">
            <button
              type="button"
              className="theme-btn toggle-filters"
              data-bs-toggle="offcanvas"
              data-bs-target="#filter-sidebar"
            >
              <span className="icon icon-filter" />
              Filter
            </button>
          </div>

          <div className="text">
            Show <strong>{Number.isFinite(count) ? count : 0}</strong> jobs
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

          {/* Sort */}
          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>

          {/* Per page */}
          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3"
            value={JSON.stringify(perPage)}
          >
            <option value={JSON.stringify({ start: 0, end: 0 })}>All</option>
            <option value={JSON.stringify({ start: 0, end: 15 })}>
              15 per page
            </option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>
              20 per page
            </option>
            <option value={JSON.stringify({ start: 0, end: 30 })}>
              30 per page
            </option>
          </select>
        </div>
      </div>
      {/* End top filter bar box */}
    </>
  );
};

export default FilterTopBox;
