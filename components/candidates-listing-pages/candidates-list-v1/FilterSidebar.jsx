'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";

import DestinationRangeSlider from "../components/DestinationRangeSlider";
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";
import Experience from "../components/Experience";

import {
  addKeyword,
  addLocation,
  addDestination,
  clearExperienceF,
} from "../../../features/filter/candidateFilterSlice";
import {
  clearExperience,
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

  // Initialize filters from URL params only once
  useEffect(() => {
    const service = searchParams.get("service") || "";
    const location = searchParams.get("location") || "";

    if (service) dispatch(addKeyword(service));
    if (location) dispatch(addLocation(location));
    
    // Set default destination to max range
    dispatch(addDestination({ min: 0, max: 100 }));
  }, []);

  return (
    <div className="inner-column pd-right">
      <div className="filters-outer">
        <button
          type="button"
          className="btn-close text-reset close-filters show-1023"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>

        {/* Search by Keywords */}
        <div className="filter-block">
          <h4>Search by Keywords</h4>
          <div className="form-group">
            <SearchBox />
          </div>
        </div>

        {/* Location + Radius */}
        <div className="filter-block">
          <h4>Location</h4>
          <div className="form-group">
            <LocationBox />
          </div>
          <p>Radius around selected destination</p>
          <DestinationRangeSlider />
        </div>

        {/* Experience Level */}
        <div className="checkbox-outer">
          <h4>Experience Level</h4>
          <Experience />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
