// components/home/hero-13/HeroSearch.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/* Local date helpers (no UTC conversion) */
const pad = (n) => String(n).padStart(2, '0');
const toLocalKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromLocalKey = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };

/* ── Calendar ─────────────────────────────────────────────────────────────── */
const Calendar = ({ selectedDate, onDateSelect }) => {
  // use local date parsing so header/month and selection work everywhere
  const [date, setDate] = useState(selectedDate ? fromLocalKey(selectedDate) : new Date());
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const changeMonth = (n) => setDate(p => new Date(p.getFullYear(), p.getMonth() + n, 1));

  const renderDays = () => {
    const y = date.getFullYear(), m = date.getMonth();
    const total = daysInMonth(y, m), start = firstDayOfMonth(y, m);
    const out = [];
    for (let i = 0; i < start; i++) out.push(<div key={`b-${i}`} className="calendar-day blank" />);
    for (let i = 1; i <= total; i++) {
      const d = new Date(y, m, i);
      const key = toLocalKey(d);                          // <-- local key
      const isSel = selectedDate === key;                 // <-- compare keys
      const isToday = toLocalKey(new Date()) === key;
      out.push(
        <button
          key={i}
          className={`calendar-day ${isSel ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => onDateSelect(key)}             
        >
          {i}
        </button>
      );
    }
    return out;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-name">Su</div><div className="calendar-day-name">Mo</div>
        <div className="calendar-day-name">Tu</div><div className="calendar-day-name">We</div>
        <div className="calendar-day-name">Th</div><div className="calendar-day-name">Fr</div>
        <div className="calendar-day-name">Sa</div>
        {renderDays()}
      </div>

      {/* Calendar styles (scoped) */}
      <style jsx>{`
        .calendar-container{width:320px;margin:auto}
        .calendar-header{display:flex;justify-content:space-between;align-items:center;padding-bottom:1rem}
        .calendar-header button{background:none;border:none;font-size:1.2rem;cursor:pointer;padding:.5rem;border-radius:50%;width:36px;height:36px}
        .calendar-header button:hover{background:var(--bg-gray,#f3f4f6)}
        .calendar-header span{font-weight:600}
        .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
        .calendar-day-name,.calendar-day{display:flex;align-items:center;justify-content:center;height:36px;text-align:center;font-size:.9rem}
        .calendar-day-name{font-weight:500;color:var(--text-secondary,#667085)}
        .calendar-day{background:none;border:none;cursor:pointer;border-radius:50%}
        .calendar-day.blank{cursor:default}
        .calendar-day:not(.blank):hover{background:var(--bg-gray,#f3f4f6)}
        .calendar-day.today{font-weight:bold;border:1px solid var(--text-primary,#111827)}
        /* FIXED rule: removed stray '!' so it actually applies */
        .calendar-day.selected{background:#4B9B97;color:#fff;font-weight:bold;border:none}
      `}</style>
    </div>
  );
};

/* ── HeroSearch ───────────────────────────────────────────────────────────── */
export default function HeroSearch() {
  const router = useRouter();
  const [activeField, setActiveField] = useState(null);
  const isOpen = Boolean(activeField);
  const searchRef = useRef(null);

  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');   // stores local key YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState('');

  const [serviceSuggestions, setServiceSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const allServices = [
    'End-of-Tenancy Clean','Deep Cleaning','Regular Domestic Cleaning','Commercial Office Clean',
    'Carpet Cleaning','Window Cleaning','After-Party Cleaning','Biohazard Cleanup'
  ];

  useEffect(() => {
    const away = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setActiveField(null); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  useEffect(() => {
    if (serviceQuery.length > 1)
      setServiceSuggestions(allServices.filter(s => s.toLowerCase().includes(serviceQuery.toLowerCase())));
    else setServiceSuggestions([]);
  }, [serviceQuery]);

  useEffect(() => {
    if (locationQuery.length < 3) { setLocationSuggestions([]); return; }
    setIsFetchingLocation(true);
    const t = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}`)
        .then(r => r.json())
        .then(d => { setLocationSuggestions(d.slice(0,5)); setIsFetchingLocation(false); })
        .catch(() => setIsFetchingLocation(false));
    }, 500);
    return () => clearTimeout(t);
  }, [locationQuery]);

  const handleGetNearby = () => {
    setLocationQuery('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords:{ latitude, longitude } }) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(r => r.json())
          .then(d => { setLocationQuery(d.display_name || 'Your Current Location'); setLocationSuggestions([]); });
      },
      () => setLocationQuery('Could not get location')
    );
  };

  const formatDateTime = () => {
    if (!selectedDate) return 'Select date';
    const dt = fromLocalKey(selectedDate); // parse as local date
    const datePart = dt.toLocaleDateString('en-US',{ weekday:'short', month:'short', day:'numeric' });
    return selectedTime ? `${datePart}, ${selectedTime}` : datePart;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const svc = (serviceQuery || '').trim();
    const loc = (locationQuery || '').trim();

    // Ignore placeholders
    if (svc && svc !== 'I need help with...') params.append('service', svc);
    if (loc && loc !== 'Postcode or area' && loc !== 'Getting your location...' && loc !== 'Could not get location') {
      params.append('location', loc);
    }
    if (selectedDate) params.append('date', selectedDate); // local key YYYY-MM-DD
    if (selectedTime) params.append('time', selectedTime);

    const qs = params.toString();
    router.push(qs ? `/cleaners?${qs}` : '/cleaners');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className={`hero-section ${isOpen ? 'is-open' : ''}`}>
      {/* Background video */}
      <div className="hero-background">
        <video src="/images/videos/hero-room.mp4" autoPlay loop muted playsInline className="hero-video" />
      </div>

      {/* Foreground */}
      <div className="hero-container">
        <div className="hero-text-content">
          <h1>Find Trusted Cleaners, Anytime, Anywhere.</h1>
          <p>Your sparkling space is just a click away.</p>
        </div>

        <div ref={searchRef} className={`interactive-search-container ${activeField ? 'active' : ''}`}>
          <div className="interactive-search-bar">
            <div className={`search-bar-field ${activeField === 'service' ? 'active' : ''}`} onClick={() => setActiveField('service')}>
              <label>What service?</label>
              <span>{serviceQuery || 'I need help with...'}</span>
            </div>

            <div className="field-divider" />

            <div className={`search-bar-field ${activeField === 'where' ? 'active' : ''}`} onClick={() => setActiveField('where')}>
              <label>Where?</label>
              <span>{locationQuery || 'Postcode or area'}</span>
            </div>

            <div className="field-divider" />

            <div className={`search-bar-field ${activeField === 'when' ? 'active' : ''}`} onClick={() => setActiveField('when')}>
              <label>When?</label>
              <span>{formatDateTime()}</span>
            </div>

            <button className="search-submit-main" onClick={handleSearch} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {activeField && (
            <div className="search-dropdown">
              {activeField === 'service' && (
                <div className="dropdown-content">
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., End-of-tenancy clean"
                    autoFocus
                  />
                  <ul className="suggestions-list">
                    {serviceSuggestions.map(s => (
                      <li key={s} onClick={() => { setServiceQuery(s); setActiveField('where'); }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeField === 'where' && (
                <div className="dropdown-content">
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter postcode or city"
                    autoFocus
                  />
                  <ul className="suggestions-list">
                    <li className="location-nearby-btn" onClick={handleGetNearby}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 0114 0z" />
                      </svg>
                      Use my current location
                    </li>
                    {isFetchingLocation && <li>Loading...</li>}
                    {locationSuggestions.map(loc => (
                      <li key={loc.place_id} onClick={() => { setLocationQuery(loc.display_name); setActiveField('when'); }}>
                        {loc.display_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeField === 'when' && (
                <div className="dropdown-content">
                  <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                  {selectedDate && (
                    <div className="time-selector">
                      <button className={`time-slot-btn ${selectedTime === 'Morning' ? 'selected' : ''}`} onClick={() => setSelectedTime('Morning')}>Morning</button>
                      <button className={`time-slot-btn ${selectedTime === 'Afternoon' ? 'selected' : ''}`} onClick={() => setSelectedTime('Afternoon')}>Afternoon</button>
                      <button className={`time-slot-btn ${selectedTime === 'Evening' ? 'selected' : ''}`} onClick={() => setSelectedTime('Evening')}>Evening</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="post-job-text">
          {/* Prefer to post a job? <a href="/post-job">Click here</a> */}
          Are you looking for a job? <a href="/jobs">Click here</a>
        </div>
      </div>

      {/* Styles for the hero (scoped) */}
      <style jsx>{`
        /* ===== STACKING / LAYERING FIX ===== */
        .hero-section{position:relative;isolation:isolate;z-index:1;max-width:1280px;min-height:500px;margin:2rem auto;overflow:visible;}
        .hero-background{position:absolute;inset:0;z-index:0;border-radius:24px;overflow:hidden}
        .hero-video{width:100%;height:100%;object-fit:cover;display:block}
        .hero-background::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5));z-index:0;pointer-events:none}
        .hero-container{position:relative;z-index:2;width:100%;max-width:1280px;padding:4rem 2rem}
        .interactive-search-container{position:relative;z-index:3;max-width: 850px;margin: 0px auto;}  /* keeps dropdown over headings */
        .search-dropdown{position:absolute;left:0;right:0;top:calc(100% + 10px);}

        /* ===== Headings ===== */
        .hero-text-content{text-align:center;color:var(--white,#fff);max-width:700px;margin:0 auto 40px;pointer-events:none}
        .hero-text-content h1,.hero-text-content p{ text-shadow:2px 2px 6px rgba(0,0,0,.7)}
        .hero-text-content h1{font-size:3rem;font-weight:800;margin-bottom:1rem}
        .hero-text-content p{font-size:1.4rem;color:var(--white,#fff);font-weight:600}

        /* ===== Search pill ===== */
        .interactive-search-bar{display:flex;align-items:center;background:#fff;border-radius:999px;box-shadow:0 10px 25px -5px rgba(0,0,0,.2);padding:.5rem .5rem .5rem 1.5rem;gap:1rem;cursor:pointer}
        .search-bar-field{flex:1;min-width:0;padding:.5rem 1rem;border-radius:999px;transition:background-color .2s}
        .search-bar-field label{font-size:.8rem;font-weight:600;display:block}
        .search-bar-field span{color:var(--text-secondary,#667085);font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
        .search-bar-field:hover,.search-bar-field.active{background:var(--bg-gray,#f3f4f6)}
        .field-divider{width:1px;height:30px;background:var(--border-color,#e5e7eb);flex:0 0 auto}
        .search-submit-main{background:var(--brand-color,#2aa389);color:#fff;border:none;border-radius:50%;width:48px;height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:1rem;transition:background-color .2s,transform .2s}
        .search-submit-main:hover{background:var(--brand-color-hover,#269b81);transform:scale(1.05)}

        /* ===== Dropdown box ===== */
        .dropdown-content{background:#fff;border-radius:24px;box-shadow:0 10px 25px -5px rgba(0,0,0,.2);padding:1.5rem;animation:heroFadeIn .3s forwards}
        .dropdown-content input{width:100%;padding:.75rem 1rem;border:1px solid var(--border-color,#e5e7eb);border-radius:8px;font-size:1rem;outline:none}
        .dropdown-content input:focus{border-color:var(--brand-color,#2aa389)}
        .suggestions-list{list-style:none;margin-top:1rem;padding:0}
        .suggestions-list li{padding:.75rem 1rem;cursor:pointer;border-radius:8px}
        .suggestions-list li:hover{background:var(--bg-gray,#f3f4f6)}
        .location-nearby-btn{display:flex;align-items:center;gap:.5rem;font-weight:500}

        /* ===== Time slots ===== */
        .time-selector{border-top:1px solid var(--border-color,#e5e7eb);margin-top:1rem;padding-top:1rem;display:flex;justify-content:space-around;gap:.5rem;flex-wrap:wrap}
        .time-slot-btn{flex:1;min-width:110px;padding:.5rem;border:1px solid var(--border-color,#e5e7eb);border-radius:8px;background:none;cursor:pointer;transition:all .2s;font-size:.85rem}
        .time-slot-btn:hover{border-color:var(--brand-color,#2aa389)}
        .time-slot-btn.selected{background:var(--brand-color,#2aa389);color:#fff;border-color:var(--brand-color,#2aa389)}

        /* ===== Below-hero text ===== */
        .post-job-text{text-align:center;margin-top:1.5rem;font-size:.9rem;color:rgba(255,255,255,0.9)}
        .post-job-text a{color:#fff;font-weight:500;text-decoration:underline;text-shadow:1px 1px 2px rgba(0,0,0,.5)}

        @keyframes heroFadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

        /* ===== Responsive ===== */
        @media (max-width:768px){
          .hero-section{min-height:550px;margin:1rem;padding:1rem}
          .hero-text-content{margin-bottom:2rem}
          .hero-text-content h1{font-size:2rem}
          .hero-text-content p{font-size:1.1rem}
          .interactive-search-bar{flex-direction:column;align-items:stretch;gap:.5rem;border-radius:24px;padding:.75rem}
          .field-divider{display:none}
          .search-bar-field{padding:.75rem 1rem}
          .search-submit-main{width:100%;border-radius:8px;margin:.5rem 0 0 0}
          .search-dropdown{top:100%;width:100%;border-radius:24px}
        }
        @media (max-width:480px){
          .hero-section{min-height:500px}
          .post-job-text{text-align:center}
        }
      `}</style>
    </section>
  );
}
