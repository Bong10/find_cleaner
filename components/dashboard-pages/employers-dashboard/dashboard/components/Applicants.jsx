// components/.../dashboard/components/Applicants.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

const fallbackAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='100%' height='100%' rx='28' ry='28' fill='#EEF2FF'/><text x='50%' y='56%' font-size='22' text-anchor='middle' fill='#4F46E5' font-family='Arial, Helvetica, sans-serif'>C</text></svg>`
  );

export default function Applicants({ items = [], loading = false }) {
  if (loading) return <div className="col-12" style={{ padding: 12 }}>Loading…</div>;
  if (!items.length) return <div className="col-12" style={{ padding: 12 }}>No applicants yet.</div>;

  return (
    <>
      {items.map((a) => (
        <div className="candidate-block-three col-lg-6 col-md-12 col-sm-12" key={a.application_id}>
          <div className="inner-box">
            <div className="content">
              <figure className="image">
                <Image width={56} height={56} src={fallbackAvatar} alt="candidate" />
              </figure>
              <h4 className="name">
                <Link href="/employers-dashboard/all-applicants">{a.cleaner_name || a.cleaner}</Link>
              </h4>
              <ul className="candidate-info">
                <li className="designation">{a.job_title || a.job || "—"}</li>
                <li>
                  <span className="icon flaticon-time"></span> {a.date_applied?.slice(0, 10) || "—"}
                </li>
                <li>
                  <span className={`status-badge status-${a.status}`}>
                    {a.status === "p" ? "Pending" : a.status === "a" ? "Accepted" : "Rejected"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid #eee;
        }
        .status-p { background:#fff9eb; color:#b45309; border-color:#fde68a; }
        .status-a { background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
        .status-r { background:#fef2f2; color:#991b1b; border-color:#fecaca; }
      `}</style>
    </>
  );
}
