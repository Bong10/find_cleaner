// components/.../shortlisted-resumes/components/WidgetToFilterBox.jsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { selectShortlist, setShortlistQuery } from "@/store/slices/shortlistSlice";

export default function WidgetToFilterBox() {
  const dispatch = useDispatch();
  const { query = "" } = useSelector(selectShortlist) || {};
  return (
    <div className="chosen-outer">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search shortlisted cleaners…"
          value={query}
          onChange={(e) => dispatch(setShortlistQuery(e.target.value))}
        />
      </div>
    </div>
  );
}
