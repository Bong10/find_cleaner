'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * Notification item contract (what this component expects):
 * {
 *   id: string|number,
 *   icon?: string,              // e.g., 'flaticon-briefcase' | defaults to 'flaticon-bell'
 *   actor?: string,             // e.g., 'Jane Doe'
 *   action?: string,            // e.g., 'applied for'
 *   subject?: string,           // e.g., 'Office Cleaning'
 *   time?: string,              // e.g., '2h ago'
 *   href?: string,              // link to details, optional
 *   variant?: ''|'success'|'warning'|'danger',
 * }
 */

export default function Notification({
  // If you pass items from the page, we'll render those.
  // Keep it [] to show ZERO by default.
  items = [],
  // Show a skeleton while your page is loading notifications.
  loading = false,
  // Optional: provide a fetcher function to load notifications here
  // when you’re ready to plug in the backend. If items are provided,
  // fetcher is ignored.
  fetcher,                  // async () => Promise<Array<NotificationItem>>
  autoRefreshMs = 0,        // e.g., 60000 to refresh every minute (0 = off)
  onItems,                  // optional callback when items load internally
}) {
  const externalItems = Array.isArray(items) ? items : [];
  const canSelfFetch = typeof fetcher === 'function' && externalItems.length === 0;

  const [internal, setInternal] = useState({
    loading: false,
    data: [],
    error: null,
  });

  // Internal fetch when fetcher is provided and you didn't pass items yet.
  useEffect(() => {
    let timer;
    let cancelled = false;

    async function load() {
      if (!canSelfFetch) return;
      try {
        if (!cancelled) setInternal((s) => ({ ...s, loading: true, error: null }));
        const data = await fetcher();
        if (!cancelled) {
          const safe = Array.isArray(data) ? data : [];
          setInternal({ loading: false, data: safe, error: null });
          onItems?.(safe);
        }
      } catch (err) {
        if (!cancelled) setInternal({ loading: false, data: [], error: err || 'Failed to load' });
      }
    }

    load();

    if (autoRefreshMs > 0 && canSelfFetch) {
      timer = setInterval(load, autoRefreshMs);
    }

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [canSelfFetch, fetcher, autoRefreshMs, onItems]);

  // Decide which dataset to render
  const dataSet = externalItems.length ? externalItems : internal.data;
  const isLoading = loading || (canSelfFetch && internal.loading);

  // Minimal loading skeleton
  if (isLoading) {
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

  // Empty state (ZERO)
  if (!dataSet || dataSet.length === 0) {
    return (
      <ul className="notification-list">
        <li className="ntf-empty">No notifications yet</li>
        <style jsx>{`
          .ntf-empty {
            text-align: center;
            padding: 14px;
            color: #98a2b3;
            font-size: 13px;
          }
        `}</style>
      </ul>
    );
  }

  // Render the list
  return (
    <ul className="notification-list">
      {dataSet.map((n) => {
        const {
          id,
          icon: iconName,
          iconColor,
          iconBg,
          actor,
          action,
          subject,
          time,
          href,
          variant = '',
        } = n || {};
        const icon = iconName || 'la-bell';

        return (
          <li key={id} className={`ntf-row ${variant}`}>
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
                  <Link href={href} className="ntf-link">
                    View
                  </Link>
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
