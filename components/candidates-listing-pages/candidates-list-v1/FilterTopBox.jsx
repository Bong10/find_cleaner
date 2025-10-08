// components/candidates-listing-pages/candidates-list-v1/FilterTopBox.jsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  clearAll,
  addSort,
  addPerPage,
} from "../../../features/filter/candidateFilterSlice";

const FilterTopBox = ({ count = 0 }) => {
  const dispatch = useDispatch();

  const {
    keyword,
    location,
    experiences,
    sort,
    perPage
  } = useSelector((state) => state.candidateFilter) || {};

  // Handle clear all
  const handleClearAll = () => {
    dispatch(clearAll());
  };

  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  const perPageHandler = (e) => {
    const value = e.target.value;
    if (value === "all") {
      dispatch(addPerPage({ start: 0, end: 0 }));
    } else {
      const perPageNum = parseInt(value);
      dispatch(addPerPage({ start: 0, end: perPageNum }));
    }
  };

  // Check if any filters are active
  const hasActiveFilters = 
    (keyword && keyword !== "") ||
    (location && location !== "") ||
    (experiences && experiences.length > 0);

  // Get current per page value for select
  const getCurrentPerPage = () => {
    if (!perPage || perPage.end === 0) return "all";
    return perPage.end.toString();
  };

  return (
    <div className="ls-switcher">
      <div className="show-result">
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
          Show <strong>{count}</strong> cleaners
        </div>
      </div>

      <div className="sort-by d-flex align-items-center gap-2">
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="btn btn-danger text-nowrap"
            style={{ minHeight: "45px", padding: "0 20px" }}
          >
            Clear All
          </button>
        )}

        <select
          value={sort || ""}
          className="chosen-single form-select"
          onChange={sortHandler}
          style={{ minWidth: "150px" }}
        >
          <option value="">Sort by (default)</option>
          <option value="asc">Oldest First</option>
          <option value="des">Newest First</option>
        </select>

        <select
          value={getCurrentPerPage()}
          onChange={perPageHandler}
          className="chosen-single form-select"
          style={{ minWidth: "120px" }}
        >
          <option value="all">All</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="30">30 per page</option>
        </select>
      </div>
    </div>
  );
};

export default FilterTopBox;
