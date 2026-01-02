// components/.../shortlist/components/WidgetContentBox.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectShortlist,
  loadShortlist,
  removeShortlisted,
} from "@/store/slices/shortlistSlice";
import { toast } from "react-toastify";

// simple fallback avatar
const fallbackAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='54%' font-size='32' text-anchor='middle' fill='#9CA3AF'>👤</text></svg>`
  );

export default function WidgetContentBox() {
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ defensive defaults so UI never crashes on undefined
  const {
    items = [],
    status = "idle",
    query = "",
    removingIds = {},
  } = useSelector(selectShortlist) || {};

  useEffect(() => {
    if (status === "idle") dispatch(loadShortlist());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        String(x.cleaner_name || "").toLowerCase().includes(q) ||
        String(x.job_title || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const onViewCleaner = (cleanerId) => {
    router.push(`/employers-dashboard/all-applicants?cleaner=${cleanerId}`);
  };

  const onBookCleaner = () => {
    toast.info("Booking flow is coming soon.");
  };

  const onRemove = (shortlistId) => {
    if (shortlistId == null) {
      toast.error("Missing shortlist id");
      return;
    }
    // ✅ pass as object { id } — matches slice thunk signature
    dispatch(removeShortlisted({ id: shortlistId }));
  };

  if (status === "loading") {
    return (
      <div className="widget-content">
        <p>Loading shortlist…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="widget-content">
        <p>Failed to load shortlist.</p>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="widget-content">
        <p>No shortlisted cleaners found.</p>
      </div>
    );
  }

  return (
    <div className="widget-content">
      <div className="row">
        {filtered.map((row) => (
          <div className="candidate-block-three col-lg-6 col-md-12 col-sm-12" key={row.id}>
            <div className="inner-box">
              <div className="content">
                <figure className="image">
                  <Image width={90} height={90} src={fallbackAvatar} alt="candidate" />
                </figure>

                <h4 className="name">
                  <Link href="#">{row.cleaner_name}</Link>
                </h4>

                <ul className="candidate-info">
                  <li className="designation">Job: {row.job_title || row.job}</li>
                  <li>
                    <span className="icon flaticon-time"></span>{" "}
                    Shortlisted on {row.created_at?.slice(0, 10) || "—"}
                  </li>
                </ul>
              </div>

              <div className="option-box">
                <ul className="option-list">
                  {/* Book Cleaner (toast only, as requested) */}
                  <li title="Book Cleaner">
                    <button data-text="Book Cleaner" onClick={onBookCleaner}>
                      <span className="la la-check-circle"></span>
                    </button>
                  </li>

                  {/* View Cleaner */}
                  <li title="View Cleaner">
                    <button
                      data-text="View Cleaner"
                      onClick={() => onViewCleaner(row.cleaner)}
                    >
                      <span className="la la-eye"></span>
                    </button>
                  </li>

                  {/* Remove from shortlist */}
                  <li title="Remove">
                    <button
                      data-text="Remove"
                      onClick={() => onRemove(row.id)}
                      disabled={!!removingIds[row.id]}
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No design changes */}
    </div>
  );
}
