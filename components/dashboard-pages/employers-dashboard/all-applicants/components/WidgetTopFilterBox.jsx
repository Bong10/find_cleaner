"use client";
import { useDispatch, useSelector } from "react-redux";
import { selectAllApplicants, setApplicantsQuery } from "@/store/slices/allApplicantsSlice";

export default function WidgetTopFilterBox() {
  const dispatch = useDispatch();
  const { query } = useSelector(selectAllApplicants);

  return (
    <div className="aplicantion-search-bar" style={{ marginBottom: 20 }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search cleaner, job or cover letter…"
        value={query}
        onChange={(e) => dispatch(setApplicantsQuery(e.target.value))}
        style={{ maxWidth: 360 }}
      />
    </div>
  );
}
