import DatePosted from "../components/DatePosted";
import SalaryRangeSlider from "../components/SalaryRangeSlider";

const FilterSidebar = () => {
    return (
        <div className="inner-column">
            <div className="filters-outer">
                <button
                    type="button"
                    className="btn-close text-reset close-filters show-1023"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >X</button>
                {/* End .close filter */}

                <div className="checkbox-outer">
                    <h4>Date Posted</h4>
                    <DatePosted />
                </div>
                {/* <!-- Checkboxes Ouer --> */}
                {/*
                <div className="checkbox-outer">
                    <h4>Experience Level</h4>
                    <ExperienceLevel />
                </div>
                 <!-- Checkboxes Ouer --> */}

                <div className="filter-block">
                    <h4>Salary</h4>

                    <SalaryRangeSlider />
                </div>
                {/* <!-- Filter Block --> */}
                {/* <!-- Filter Block --> */}
            </div>
            {/* Filter Outer */}
        </div>
    );
};

export default FilterSidebar;
