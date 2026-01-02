"use client";

import { useDispatch, useSelector } from "react-redux";
import { addDatePosted } from "@/store/slices/filterSlice";

const DatePosted = () => {
  const dispatch = useDispatch();

  const datePostOptions = [
    { id: "all", name: "All", value: "all" },
    { id: "today", name: "Last Hour", value: "today" },
    { id: "last-24-hours", name: "Last 24 Hours", value: "last-24-hours" },
    { id: "last-7-days", name: "Last 7 Days", value: "last-7-days" },
    { id: "last-14-days", name: "Last 14 Days", value: "last-14-days" },
    { id: "last-30-days", name: "Last 30 Days", value: "last-30-days" },
  ];

  const selected = useSelector((s) => s.filter?.jobList?.datePosted) || "all";

  const onPick = (value) => dispatch(addDatePosted(value));

  return (
    <ul className="switchbox">
      {datePostOptions.map((item) => {
        const inputId = `datePosted-${item.id}`;
        return (
          <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Toggle control */}
            <label className="switch" htmlFor={inputId} style={{ margin: 0 }}>
              <input
                id={inputId}
                type="radio"                 // keep radio (single select)
                name="datePosted"
                value={item.value}
                checked={selected === item.value}
                onChange={() => onPick(item.value)}
              />
              <span className="slider round"></span>
            </label>

            {/* Clickable title bound to the same input */}
            <label htmlFor={inputId} className="title" style={{ cursor: "pointer", margin: 0 }}>
              {item.name}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default DatePosted;
