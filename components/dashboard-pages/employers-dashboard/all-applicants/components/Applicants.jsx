// components/.../all-applicants/Applicants.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUniqueCleanerRows } from "@/store/slices/allApplicantsSlice";

// tiny fallback avatar (unchanged)
const fallbackAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='54%' font-size='32' text-anchor='middle' fill='#9CA3AF'>👤</text></svg>`
  );

export default function Applicants() {
  const router = useRouter();
  const cleaners = useSelector(selectUniqueCleanerRows);

  const goToCleaner = (cleanerId, opts = {}) => {
    const q = new URLSearchParams({ cleaner: String(cleanerId), ...opts }).toString();
    // IMPORTANT: stay on the SAME dashboard page
    router.push(`/employers-dashboard/all-applicants?${q}`);
  };

  return (
    <>
      {cleaners.map((row) => {
        const avatar = row.avatar || fallbackAvatar;

        return (
          <div
            className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
            key={row.cleaner_id}
          >
            <div className="inner-box">
              <div className="content">
                <figure className="image">
                  <Image width={90} height={90} src={avatar} alt="candidate" />
                </figure>

                <h4 className="name">
                  <Link href="#">{row.cleaner_name}</Link>
                </h4>

                <ul className="candidate-info">
                  <li className="designation">
                    Applied to {row.applications.length} job
                    {row.applications.length > 1 ? "s" : ""}
                  </li>
                  <li>
                    <span className="icon flaticon-time"></span>{" "}
                    {row.pending_count} pending
                  </li>
                  <li>
                    <span className="icon flaticon-tick"></span>{" "}
                    {row.accepted_count} accepted
                  </li>
                </ul>
              </div>

              <div className="option-box">
                <ul className="option-list">
                  {/* Book Cleaner -> same page, show details (optionally focus pending) */}
                  <li title="Book Cleaner">
                    <button
                      data-text="Book Cleaner"
                      onClick={ () => {toast.info("Booking flow will be added soon.");}}>
                      <span className="la la-check-circle"></span>
                    </button>
                  </li>

                  {/* View Cleaner -> same page, show details */}
                  <li title="View Cleaner">
                    <button
                      data-text="View Cleaner"
                      onClick={() => goToCleaner(row.cleaner_id)}
                    >
                      <span className="la la-eye"></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
