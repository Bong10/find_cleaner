import Link from "next/link";
import { useMemo } from 'react';

export default function Notification({ items = [], loading = false }) {
  const dataSet = Array.isArray(items) ? items : [];

  if (loading) {
    return (
      <ul className="notification-list">
        {[1, 2, 3].map((i) => (
          <li key={i} className="ntf-row">
            <span className="ntf-icon ntf-skeleton" />
            <div className="ntf-body">
              <div className="ntf-line ntf-skeleton" />
              <div className="ntf-line ntf-skeleton short" />
            </div>
          </li>
        ))}
        <style jsx>{`
          .ntf-row { display:flex; align-items:center; gap:12px; padding:10px 0; }
          .ntf-icon { width:32px; height:32px; border-radius:999px; }
          .ntf-skeleton { background: linear-gradient(90deg, #eef2f7, #f5f7fb, #eef2f7); }
          .ntf-body { flex:1; }
          .ntf-line { height:10px; border-radius:6px; margin:4px 0; }
          .ntf-line.short { width:40%; }
        `}</style>
      </ul>
    );
  }

  if (!dataSet || dataSet.length === 0) {
    return (
      <ul className="notification-list">
        <li className="ntf-empty">No notifications yet</li>
        <style jsx>{`
          .ntf-empty { text-align:center; padding:14px; color:#98a2b3; font-size:13px; }
        `}</style>
      </ul>
    );
  }

  return (
    <ul className="notification-list">
      {dataSet.map((n) => {
        const { id, icon: iconName, iconColor, iconBg, actor, action, subject, time, href } = n || {};
        const icon = iconName || 'la-bell';
        return (
          <li key={id} className={`ntf-row`}>
            <span className={`ntf-icon`} aria-hidden style={{ background: iconBg || '#f0f5ff', color: iconColor || '#1967d2' }}>
              <i className={`la ${icon}`} />
            </span>
            <div className="ntf-body">
              <div className="ntf-line-1">
                {actor && <strong className="ntf-actor">{actor}</strong>} {action}{' '}
                {subject && <span className="ntf-subject">{subject}</span>}
              </div>
              <div className="ntf-line-2">
                {time && <span className="ntf-time">{time}</span>}
                {href && (
                  <Link href={href} className="ntf-link">View</Link>
                )}
              </div>
            </div>
          </li>
        );
      })}

      <style jsx>{`
        .ntf-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px dashed #eef2f7; }
        .ntf-row:last-child { border-bottom:none; }
        .ntf-icon { width:45px; height:45px; border-radius:10px; background:#f0f5ff; color:#1967d2; display:inline-flex; align-items:center; justify-content:center; }
  .ntf-icon .la { font-size:20px; line-height:1; }
        .ntf-body { flex:1; min-width:0; }
        .ntf-line-1 { color:#0f172a; font-size:14px; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ntf-actor { font-weight:700; margin-right:4px; }
        .ntf-subject { color:#1967d2; font-weight:600; }
        .ntf-line-2 { margin-top:4px; display:flex; align-items:center; gap:10px; font-size:12px; }
        .ntf-time { color:#94a3b8; }
        .ntf-link { color:#1967d2; font-weight:600; }
      `}</style>
    </ul>
  );
}

/* 
  Backend Integration Notes:
  
  Expected API endpoint: GET /api/notifications/
  
  Expected response format:
  {
    data: [
      {
        id: 1,
        icon: "flaticon-briefcase",
        text: "New cleaning job in ",
        highlight: "Downtown Office",
        time: "1 hour ago"
      }
    ]
  }
*/
