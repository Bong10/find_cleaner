"use client";

import { useDispatch, useSelector } from "react-redux";
import { addDatePosted } from "@/store/slices/filterSlice";
import { datePostCheck } from "@/store/slices/jobsSlice";

const DatePosted = () => {
  const dispatch = useDispatch();

  // options (with names/ids) come from jobsSlice
  const datePost = useSelector((state) => state.jobs.browse.datePost) || [];

  // the actual selected value comes from filterSlice
  const selected = useSelector(
    (state) => state.filter.jobList.datePosted
  );

  const onChange = (e, id) => {
    const value = e.target.value;
    dispatch(addDatePosted(value)); // update filter slice
    dispatch(datePostCheck(id));    // update isChecked flags in jobs slice
  };

  return (
    <ul className="ui-checkbox">
      {datePost.map((item) => {
        const inputId = `date-posted-${item.id}`;
        return (
          <li key={item.id}>
            <label htmlFor={inputId}>
              <input
                id={inputId}
                type="radio"                 // radios behave mutually exclusive
                name="date-posted"           // all in one group
                value={item.value}
                checked={selected === item.value}
                onChange={(e) => onChange(e, item.id)}
              />
              <span></span>
              <p>{item.name}</p>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default DatePosted;
