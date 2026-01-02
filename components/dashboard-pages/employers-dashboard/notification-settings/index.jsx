'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAvailableNotificationEvents,
  getNotificationPreferences,
  patchNotificationPreferences,
  resetNotificationPreferences,
} from '@/services/notificationPreferencesService';

const CHANNELS = [
  { key: 'email', label: 'Email', icon: 'la la-envelope' },
  { key: 'push', label: 'Push', icon: 'la la-bell' },
  { key: 'sms', label: 'SMS', icon: 'la la-sms' },
];

const CHANNEL_KEYS = CHANNELS.map((c) => c.key);

const coerceEvents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.events)) return payload.events;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

const titleCase = (value) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());

const ensureSet = (arr) => new Set(Array.isArray(arr) ? arr : []);

const normalizeAvailableEvents = (payload) => {
  // Common shapes:
  // - ['job_applied', ...]
  // - [{ key: 'job_applied', label: 'Job Applied' }, ...]
  // - [{ event: 'job_applied', name: 'Job Applied' }, ...]
  // - { job_applied: 'Job Applied', ... }
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    !Array.isArray(payload.events) &&
    !Array.isArray(payload.data)
  ) {
    const mapped = payload.events && typeof payload.events === 'object' ? payload.events : payload;
    return Object.entries(mapped)
      .map(([key, value]) => ({ key: String(key), label: titleCase(value ?? key) }))
      .filter((e) => Boolean(e.key));
  }

  const raw = coerceEvents(payload);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const key = item;
        return { key, label: titleCase(key) };
      }

      if (item && typeof item === 'object') {
        const key = item.key ?? item.event ?? item.code ?? item.name ?? item.id;
        if (!key) return null;

        const label =
          item.label ??
          item.title ??
          item.display_name ??
          item.name ??
          titleCase(key);

        return { key: String(key), label: String(label) };
      }

      return null;
    })
    .filter(Boolean);
};

const normalizePreferences = (rawPreferences) => {
  const normalized = {};
  let shape = 'array';

  if (!rawPreferences || typeof rawPreferences !== 'object') {
    return { normalized, shape };
  }

  Object.entries(rawPreferences).forEach(([eventKey, value]) => {
    let channels = [];
    let localShape = 'unknown';

    if (Array.isArray(value)) {
      localShape = 'array';
      channels = value;
    } else if (value && typeof value === 'object') {
      if (Array.isArray(value.channels)) {
        localShape = 'array';
        channels = value.channels;
      } else {
        localShape = 'object';
        channels = CHANNEL_KEYS.filter((k) => Boolean(value[k] ?? value[`${k}_enabled`]));
      }
    }

    if (localShape === 'object') shape = 'object';

    const cleaned = (Array.isArray(channels) ? channels : [])
      .map((c) => String(c))
      .filter((c) => CHANNEL_KEYS.includes(c));

    // Preserve explicit empty arrays ("disable all") when present.
    if (Array.isArray(value)) {
      normalized[eventKey] = cleaned;
      return;
    }

    if (cleaned.length) normalized[eventKey] = cleaned;
  });

  return { normalized, shape };
};

const denormalizePreferences = (normalizedPreferences, shape) => {
  if (shape === 'object') {
    const out = {};
    Object.entries(normalizedPreferences || {}).forEach(([eventKey, arr]) => {
      const set = ensureSet(arr);
      out[eventKey] = {
        email: set.has('email'),
        push: set.has('push'),
        sms: set.has('sms'),
      };
    });
    return out;
  }

  return normalizedPreferences || {};
};

const NotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('channels');

  const [dirty, setDirty] = useState(false);

  const preferencesShapeRef = useRef('array');

  const defaults = useMemo(
    () => ({
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      preferences: {},
      quiet_hours_start: null,
      quiet_hours_end: null,
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [prefData, eventsData] = await Promise.all([
          getNotificationPreferences(),
          getAvailableNotificationEvents(),
        ]);

        if (!mounted) return;
        const { normalized, shape } = normalizePreferences(prefData?.preferences || {});
        preferencesShapeRef.current = shape;

        setPrefs({ ...defaults, ...(prefData || {}), preferences: normalized });
        setEvents(normalizeAvailableEvents(eventsData));
        setDirty(false);
      } catch (e) {
        if (!mounted) return;
        toast.error('Failed to load notification preferences');
        setPrefs(defaults);
        setEvents([]);
        setDirty(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [defaults]);

  const globalEnabled = (channelKey) => {
    if (!prefs) return false;
    return Boolean(prefs[`${channelKey}_enabled`]);
  };

  const derivedGlobalChannels = () => {
    const set = new Set();
    CHANNELS.forEach(({ key }) => {
      if (globalEnabled(key)) set.add(key);
    });
    return set;
  };

  const getChannelsForEvent = (eventKey) => {
    const explicit = prefs?.preferences?.[eventKey];
    if (Array.isArray(explicit)) return ensureSet(explicit);
    return derivedGlobalChannels();
  };

  const persistPatch = async (payload, { showToast } = { showToast: false }) => {
    setSaving(true);
    try {
      const outgoing = {
        ...payload,
        preferences: denormalizePreferences(payload.preferences || {}, preferencesShapeRef.current),
      };

      const updated = await patchNotificationPreferences(outgoing);
      const { normalized, shape } = normalizePreferences(updated?.preferences || {});
      preferencesShapeRef.current = shape;

      setPrefs((prev) => ({
        ...prev,
        ...(updated || {}),
        preferences: normalized,
      }));
      setDirty(false);
      if (showToast) toast.success('Preferences saved');
    } catch (e) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const updatePrefs = (updater) => {
    setPrefs((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setDirty(true);
  };

  const toggleGlobal = (channelKey) => {
    updatePrefs((prev) => {
      const next = {
        ...prev,
        [`${channelKey}_enabled`]: !prev[`${channelKey}_enabled`],
      };

      if (!next[`${channelKey}_enabled`]) {
        const newMap = { ...(next.preferences || {}) };
        Object.keys(newMap).forEach((eventKey) => {
          const arr = Array.isArray(newMap[eventKey]) ? newMap[eventKey] : [];
          const filtered = arr.filter((c) => c !== channelKey);
          if (filtered.length === 0) delete newMap[eventKey];
          else newMap[eventKey] = filtered;
        });
        next.preferences = newMap;
      }

      return next;
    });
  };

  const toggleEventChannel = (eventKey, channelKey) => {
    if (!globalEnabled(channelKey)) return;

    updatePrefs((prev) => {
      const globalSet = new Set();
      CHANNELS.forEach(({ key }) => {
        if (Boolean(prev[`${key}_enabled`])) globalSet.add(key);
      });

      const hasExplicit = Object.prototype.hasOwnProperty.call(prev?.preferences || {}, eventKey);
      const currentSet = ensureSet(prev?.preferences?.[eventKey]);
      const derived = hasExplicit ? currentSet : globalSet;
      const nextSet = new Set(derived);

      if (nextSet.has(channelKey)) nextSet.delete(channelKey);
      else nextSet.add(channelKey);

      const nextPreferences = { ...(prev.preferences || {}) };

      const isSameAsGlobal =
        nextSet.size === globalSet.size &&
        [...nextSet].every((c) => globalSet.has(c));

      if (isSameAsGlobal) {
        delete nextPreferences[eventKey];
      } else {
        nextPreferences[eventKey] = [...nextSet];
      }

      return {
        ...prev,
        preferences: nextPreferences,
      };
    });
  };

  const setQuietHours = (key, value) => {
    updatePrefs((prev) => ({
      ...prev,
      [key]: value || null,
    }));
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const data = await resetNotificationPreferences();
      const { normalized, shape } = normalizePreferences(data?.preferences || {});
      preferencesShapeRef.current = shape;
      setPrefs({ ...defaults, ...(data || {}), preferences: normalized });
      setDirty(false);
      toast.success('Preferences reset to defaults');
    } catch (e) {
      toast.error('Failed to reset preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNow = async () => {
    if (!prefs) return;
    await persistPatch(
      {
        email_enabled: prefs.email_enabled,
        push_enabled: prefs.push_enabled,
        sms_enabled: prefs.sms_enabled,
        preferences: prefs.preferences || {},
        quiet_hours_start: prefs.quiet_hours_start || null,
        quiet_hours_end: prefs.quiet_hours_end || null,
      },
      { showToast: true }
    );
  };

  if (loading || !prefs) {
    return (
      <div style={{ padding: '30px' }}>
        <p style={{ margin: 0, color: '#696969' }}>Loading notification preferences…</p>
      </div>
    );
  }

  return (
    <div className="notification-settings-layout">
      <div className="left-panel">
        <div className="panel-header">
          <h3>Notification Preferences</h3>
          <p>Control which channels receive alerts, per event, and set quiet hours.</p>
        </div>

        <div className="accordion" id="notifPrefsAccordion">
          <div className="accordion-item accordion block active-block">
            <h2 className="accordion-header">
              <button
                className={`accordion-button acc-btn ${activeAccordion === 'channels' ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#np_channels"
                aria-expanded={activeAccordion === 'channels'}
                onClick={() => setActiveAccordion('channels')}
              >
                Channels
              </button>
            </h2>
            <div
              id="np_channels"
              className={`accordion-collapse collapse ${activeAccordion === 'channels' ? 'show' : ''}`}
              data-bs-parent="#notifPrefsAccordion"
            >
              <div className="accordion-body">
                <div className="section-pad">
                  <div className="channel-grid">
                    {CHANNELS.map((c) => (
                      <div key={c.key} className="channel-card">
                        <div className="channel-meta">
                          <i className={c.icon} />
                          <div>
                            <div className="channel-title">{c.label}</div>
                            <div className="channel-sub">Enable/disable {c.label.toLowerCase()} notifications</div>
                          </div>
                        </div>
                        <div className="channel-toggle">
                          <input
                            className="channel-checkbox"
                            type="checkbox"
                            checked={Boolean(prefs[`${c.key}_enabled`])}
                            onChange={() => toggleGlobal(c.key)}
                            disabled={saving}
                            aria-label={`${c.label} enabled`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item accordion block active-block">
            <h2 className="accordion-header">
              <button
                className={`accordion-button acc-btn ${activeAccordion === 'events' ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#np_events"
                aria-expanded={activeAccordion === 'events'}
                onClick={() => setActiveAccordion('events')}
              >
                Event Preferences
              </button>
            </h2>
            <div
              id="np_events"
              className={`accordion-collapse collapse ${activeAccordion === 'events' ? 'show' : ''}`}
              data-bs-parent="#notifPrefsAccordion"
            >
              <div className="accordion-body">
                <div className="section-pad">
                  {events?.length ? (
                    <div className="events-table-wrap">
                      <table className="events-table">
                        <thead>
                          <tr>
                            <th className="event-col">Event</th>
                            {CHANNELS.map((c) => (
                              <th key={c.key} className="chan-col">
                                <span className="chan-head">
                                  <i className={c.icon} /> {c.label}
                                </span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((evt) => {
                            const eventKey = evt.key;
                            const channels = getChannelsForEvent(eventKey);
                            const isOverride = Object.prototype.hasOwnProperty.call(
                              prefs?.preferences || {},
                              eventKey
                            );
                            return (
                              <tr key={eventKey} className={isOverride ? 'is-override' : ''}>
                                <td className="event-col">
                                  <div className="event-title">{evt.label || titleCase(eventKey)}</div>
                                  <div className="event-sub">{isOverride ? 'Custom' : 'Uses global defaults'}</div>
                                </td>
                                {CHANNELS.map((c) => {
                                  const checked = channels.has(c.key) && globalEnabled(c.key);
                                  const disabled = saving || !globalEnabled(c.key);
                                  return (
                                    <td key={c.key} className="chan-col">
                                      <div className="cell-center">
                                        <input
                                          className="channel-checkbox"
                                          type="checkbox"
                                          checked={checked}
                                          disabled={disabled}
                                          onChange={() => toggleEventChannel(eventKey, c.key)}
                                          aria-label={`${titleCase(eventKey)} via ${c.label}`}
                                        />
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="table-note">
                        Channels are disabled here if the global channel is OFF.
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#696969' }}>
                      No events returned by <code>/api/preferences/available-events/</code>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item accordion block active-block">
            <h2 className="accordion-header">
              <button
                className={`accordion-button acc-btn ${activeAccordion === 'quiet' ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#np_quiet"
                aria-expanded={activeAccordion === 'quiet'}
                onClick={() => setActiveAccordion('quiet')}
              >
                Quiet Hours
              </button>
            </h2>
            <div
              id="np_quiet"
              className={`accordion-collapse collapse ${activeAccordion === 'quiet' ? 'show' : ''}`}
              data-bs-parent="#notifPrefsAccordion"
            >
              <div className="accordion-body">
                <div className="section-pad">
                  <div className="quiet-grid">
                    <div className="quiet-field">
                      <label className="quiet-label">Start</label>
                      <input
                        type="time"
                        value={prefs.quiet_hours_start || ''}
                        onChange={(e) => setQuietHours('quiet_hours_start', e.target.value)}
                        disabled={saving}
                        className="quiet-input"
                      />
                    </div>
                    <div className="quiet-field">
                      <label className="quiet-label">End</label>
                      <input
                        type="time"
                        value={prefs.quiet_hours_end || ''}
                        onChange={(e) => setQuietHours('quiet_hours_end', e.target.value)}
                        disabled={saving}
                        className="quiet-input"
                      />
                    </div>
                  </div>
                  <div className="table-note" style={{ marginTop: 10 }}>
                    Leave both empty to disable quiet hours.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item accordion block active-block">
            <h2 className="accordion-header">
              <button
                className={`accordion-button acc-btn ${activeAccordion === 'reset' ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#np_reset"
                aria-expanded={activeAccordion === 'reset'}
                onClick={() => setActiveAccordion('reset')}
              >
                Reset
              </button>
            </h2>
            <div
              id="np_reset"
              className={`accordion-collapse collapse ${activeAccordion === 'reset' ? 'show' : ''}`}
              data-bs-parent="#notifPrefsAccordion"
            >
              <div className="accordion-body">
                <div className="section-pad">
                  <p style={{ margin: '0 0 12px', color: '#696969' }}>
                    Reset preferences back to the default values.
                  </p>
                  <button
                    type="button"
                    className="theme-btn btn-style-three"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    {saving ? 'Working…' : 'Reset to Defaults'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="save-section">
          <button
            type="button"
            className="theme-btn btn-style-one w-100"
            onClick={handleSaveNow}
            disabled={saving || !dirty}
          >
            {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>

        <div className="info-section">
          <div className="info-card">
            <i className="la la-info-circle"></i>
            <h4>How it works</h4>
            <p>
              Global channels control whether Email/SMS/Push are allowed.
              Event preferences override global defaults per event.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .notification-settings-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          padding: 0;
        }

        .left-panel {
          min-width: 0;
        }

        .panel-header {
          margin-bottom: 10px;
          padding: 30px 30px 10px;
        }

        .panel-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #202124;
          margin: 0 0 8px 0;
        }

        .panel-header p {
          font-size: 14px;
          color: #696969;
          margin: 0;
        }

        .section-pad {
          padding: 18px 30px;
        }

        .channel-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .channel-card {
          background: #f8f9fb;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .channel-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .channel-meta i {
          font-size: 22px;
          color: var(--primary-color);
        }

        .channel-title {
          font-size: 14px;
          font-weight: 600;
          color: #202124;
        }

        .channel-sub {
          font-size: 13px;
          color: #696969;
          margin-top: 2px;
        }

        .channel-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }

        .channel-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-color);
        }

        .events-table-wrap {
          overflow-x: auto;
        }

        .events-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 650px;
        }

        .events-table thead th {
          font-size: 13px;
          color: #202124;
          font-weight: 600;
          padding: 12px;
          background: #f8f9fb;
          border-bottom: 1px solid #e5e7eb;
        }

        .events-table tbody td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .event-col {
          width: 58%;
          text-align: left;
        }

        .chan-col {
          width: 14%;
          text-align: center;
        }

        .chan-head {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          width: 100%;
        }

        .chan-head i {
          color: var(--primary-color);
          font-size: 16px;
        }

        .cell-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .event-title {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          line-height: 1.2;
        }

        .event-sub {
          font-size: 12px;
          color: #696969;
          margin-top: 4px;
        }

        .table-note {
          font-size: 12px;
          color: #696969;
          margin-top: 10px;
        }

        .quiet-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .quiet-label {
          display: block;
          font-size: 13px;
          color: #202124;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .quiet-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
        }

        .right-panel {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .save-section,
        .info-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .save-section {
          margin-bottom: 20px;
        }

        .info-card i {
          font-size: 32px;
          color: var(--primary-color);
          margin-bottom: 12px;
        }

        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #202124;
          margin: 0 0 10px 0;
        }

        .info-card p {
          font-size: 13px;
          color: #696969;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .notification-settings-layout {
            grid-template-columns: 1fr;
          }

          .right-panel {
            position: static;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .panel-header {
            padding: 20px;
          }

          .right-panel {
            grid-template-columns: 1fr;
          }

          .quiet-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings;
