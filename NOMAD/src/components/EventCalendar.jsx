import React, { useState, useEffect, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, addMonths, subMonths, getDay
} from 'date-fns';
import API_BASE from '../utils/api';
import './EventCalendar.css';

const STAMP_THEMES = {
  music:       { bg: '#E8B84B', text: '#1a0e00', label: 'Music' },
  food:        { bg: '#C4543A', text: '#fff5f3', label: 'Food & Drink' },
  art:         { bg: '#4AAFB0', text: '#001616', label: 'Art' },
  workshop:    { bg: '#E07840', text: '#1a0800', label: 'Workshop' },
  gathering:   { bg: '#4E6EB5', text: '#f0f4ff', label: 'Gathering' },
  performance: { bg: '#C4607A', text: '#fff0f3', label: 'Performance' },
  outdoor:     { bg: '#6A9E52', text: '#f5fff0', label: 'Outdoor' },
  exhibition:  { bg: '#9E7850', text: '#fff5ed', label: 'Exhibition' },
  festive:     { bg: '#8050C4', text: '#f8f0ff', label: 'Festive' },
  special:     { bg: '#2B5080', text: '#f0f6ff', label: 'Special' },
  holiday:     { bg: '#D4382C', text: '#fff5f5', label: '🇮🇳 Holiday' },
};

// Rotating image pool — 31 distinct images so every day stamp looks different
const DAY_IMAGES = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70', // music concert
  'https://images.unsplash.com/photo-1563379091339-03246963d8a5?w=300&q=70', // biryani
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=70', // art gallery
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&q=70', // gathering
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=70', // nature outdoor
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&q=70', // performance stage
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&q=70', // museum
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=70', // festive lights
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=70', // conference
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=70', // workshop
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70', // food market
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=70', // live music crowd
  'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=300&q=70', // yoga outdoor
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=70', // DJ party
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=70', // colorful food
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=70', // dance performance
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=70', // cultural festival
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=70', // hiking outdoor
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=70', // books reading
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=70', // indian street food
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&q=70', // film cinema
  'https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=300&q=70', // craft market
  'https://images.unsplash.com/photo-1621784562807-cb83e77e6a5e?w=300&q=70', // pottery art
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&q=70', // community table
  'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&q=70', // sunset run
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=70', // music festival
  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=300&q=70', // indian sweets
  'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?w=300&q=70', // exhibition hall
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&q=70', // street party
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&q=70', // theatre curtain
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&q=70', // colorful balloons
];

const CALENDAR_IMAGES = [
  '/calendar/0f1d13b55f2eea189ad0a773b7f8f115.png',
  '/calendar/378bb64b2e88650049090ac14f844f53.png',
  '/calendar/4281e7b0effa3228a10684332c21eb27.png',
  '/calendar/47c8ad8f7ae0c5a136ea909c2df3105b.png',
  '/calendar/6754ea27904671481369b9b2e534c2ad.png',
  '/calendar/8dcb79dbe1d4f97c7b07d2f376516cfb.png',
  '/calendar/abe2aaacfe7b1f30e4adad7e6222ef26.png',
  '/calendar/aea1c746856fc4a20c80d622e8986448.png',
  '/calendar/b57f18d7e232140f373e7e1b0030072e.png',
  '/calendar/da9407d4f61c9d3014ef28c75ce9bb9d.png',
];

const STAMP_IMAGES = {
  music:       CALENDAR_IMAGES[7],
  food:        CALENDAR_IMAGES[9],
  art:         CALENDAR_IMAGES[8],
  gathering:   CALENDAR_IMAGES[1],
  outdoor:     CALENDAR_IMAGES[3],
  performance: CALENDAR_IMAGES[5],
  exhibition:  CALENDAR_IMAGES[2],
  festive:     CALENDAR_IMAGES[6],
  special:     CALENDAR_IMAGES[4],
  workshop:    CALENDAR_IMAGES[0],
  holiday:     CALENDAR_IMAGES[6],
};

const HYDERABAD_DAY_IMAGES = CALENDAR_IMAGES;

// Get a varied image per calendar day (day 1–31 maps to distinct images)
const getDayImage = (dayNum, type) => {
  // Use day number to pick a varied image, biased toward type if available
  const typeImg = STAMP_IMAGES[type];
  const rotatingImg = HYDERABAD_DAY_IMAGES[(dayNum - 1) % HYDERABAD_DAY_IMAGES.length];
  // Alternate: odd days use type image, even days use rotating
  return dayNum % 3 === 0 ? rotatingImg : (typeImg || rotatingImg);
};

const SPARSE_STICKERS = {
  1: CALENDAR_IMAGES[1],
  4: CALENDAR_IMAGES[3],
  9: CALENDAR_IMAGES[8],
  12: CALENDAR_IMAGES[4],
  15: CALENDAR_IMAGES[2],
  18: CALENDAR_IMAGES[5],
  21: CALENDAR_IMAGES[0],
  24: CALENDAR_IMAGES[9],
  27: CALENDAR_IMAGES[6],
  29: CALENDAR_IMAGES[7],
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const EventCalendar = ({ cityName = 'hyderabad', displayName = 'Hyderabad' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents]           = useState([]);
  const [holidays, setHolidays]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const m = format(currentDate, 'M');
      const y = format(currentDate, 'yyyy');

      // Fetch events and holidays in parallel
      try {
        const [evRes, holRes] = await Promise.all([
          fetch(`${API_BASE}/api/events/${cityName}?month=${m}&year=${y}`),
          fetch(`${API_BASE}/api/holidays/${cityName}?month=${m}&year=${y}`),
        ]);

        if (evRes.ok) {
          const d = await evRes.json();
          if (d.success && d.events)
            setEvents(d.events.map(e => ({ ...e, date: new Date(e.date) })));
        }

        if (holRes.ok) {
          const h = await holRes.json();
          if (h.success && h.holidays)
            setHolidays(h.holidays.map(hol => ({ ...hol, date: new Date(hol.date) })));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchAll();
  }, [currentDate]);

  // Build padded day array (nulls for leading empty cells)
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const days  = eachDayOfInterval({ start, end: endOfMonth(currentDate) });
    return Array(getDay(start)).fill(null).concat(days);
  }, [currentDate]);

  // Merge events + holidays for each day
  const allItems = useMemo(() => [...events, ...holidays], [events, holidays]);
  const eventsForDay = (day) => allItems.filter(e => isSameDay(e.date, day));

  const dominantType = (dayEvts) => {
    if (!dayEvts.length) return null;
    const counts = {};
    dayEvts.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="stamp-calendar hyd-calendar">

      {/* ── Header ── */}
      <div className="stamp-cal-header">
        <div>
          <span className="stamp-cal-eyebrow">{displayName} City Calendar {holidays.length > 0 && <span style={{color:'#8b2f24',marginLeft:8}}>• {holidays.length} holidays</span>}</span>
          <h2 className="stamp-cal-month">
            {format(currentDate, 'MMMM')}
            <span className="stamp-cal-year"> {format(currentDate, 'yyyy')}</span>
          </h2>
        </div>
        <div className="stamp-cal-nav">
          <button className="stamp-nav-btn" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            ← {format(subMonths(currentDate, 1), 'MMM')}
          </button>
          <button className="stamp-nav-btn" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            {format(addMonths(currentDate, 1), 'MMM')} →
          </button>
        </div>
      </div>

      {/* ── Weekday row ── */}
      <div className="stamp-weekday-row">
        {WEEKDAYS.map(w => <div key={w} className="stamp-weekday-label">{w}</div>)}
      </div>

      {/* ── Day grid ── */}
      {loading ? (
        <div className="stamp-loading">
          <div className="stamp-spinner" />
          loading {cityName} events…
        </div>
      ) : (
        <div className="stamp-day-grid">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="stamp-day-blank" />;

            const dayEvts = eventsForDay(day);
            const type    = dominantType(dayEvts);
            const theme   = type ? (STAMP_THEMES[type] || STAMP_THEMES.special) : null;
            const dayNum  = day.getDate();
            const isNow   = isToday(day);
            const topEvt  = dayEvts[0];
            const isHoliday = dayEvts.some(e => e.type === 'holiday');
            const imgUrl  = isHoliday ? null : (topEvt ? getDayImage(dayNum, type) : SPARSE_STICKERS[dayNum]);


            return (
              <div
                key={day.toISOString()}
                className={`stamp-day ${isNow ? 'stamp-day--today' : ''} ${!type ? 'stamp-day--quiet' : ''} ${isHoliday ? 'stamp-day--holiday-fill' : ''} ${topEvt && !isHoliday ? 'stamp-day--event-fill' : ''} ${imgUrl && !topEvt ? 'stamp-day--sticker-only' : ''}`}
                style={theme ? { '--sd-bg': theme.bg, '--sd-text': theme.text } : {}}
                onClick={() => setSelectedDay({ date: day, events: dayEvts })}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedDay({ date: day, events: dayEvts })}
              >
                <div className="stamp-day-inner">
                  {isNow && <div className="stamp-today-ribbon">TODAY</div>}

                  {/* Photo */}
                  {imgUrl && (
                    <div className="stamp-day-photo-wrap">
                      <img src={imgUrl} alt="" className="stamp-day-photo" loading="lazy" />
                      <div className="stamp-day-photo-fade" />
                      {dayEvts.length > 0 && (
                        <span className="stamp-event-badge">{dayEvts.length}</span>
                      )}
                    </div>
                  )}
                  {false && !imgUrl && <div className="stamp-day-photo-wrap stamp-day-photo-empty" />}

                  {/* Top event preview */}
                  <div className="stamp-day-text">
                    {dayEvts.some(e => e.type === 'holiday') && (
                      <span className="stamp-holiday-flag">🇮🇳</span>
                    )}
                    <p className={`stamp-day-preview ${dayEvts.some(e => e.type === 'holiday') ? 'stamp-day-preview--holiday' : ''}`}>
                      {topEvt ? topEvt.title : ''}
                    </p>
                  </div>

                  {/* Footer: number + day name */}
                  <div className="stamp-day-footer">
                    <span className="stamp-day-num">{format(day, 'dd')}</span>
                    <span className="stamp-day-name-abbr">{format(day, 'EEE').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Day modal ── */}
      {selectedDay && (
        <div className="stamp-modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="stamp-modal" onClick={e => e.stopPropagation()}>
            <button className="stamp-modal-close" onClick={() => setSelectedDay(null)}>×</button>

            <div className="stamp-modal-head">
              <span className="stamp-modal-big-num">{format(selectedDay.date, 'dd')}</span>
              <div className="stamp-modal-date-detail">
                <span className="stamp-modal-wday">{format(selectedDay.date, 'EEEE')}</span>
                <span className="stamp-modal-monyear">{format(selectedDay.date, 'MMMM yyyy')}</span>
                {isToday(selectedDay.date) && <span className="stamp-modal-today-pill">Today</span>}
              </div>
            </div>

            <div className="stamp-modal-divider" />

            <div className="stamp-modal-list">
              {selectedDay.events.length === 0 ? (
                <p className="stamp-modal-empty">No events scheduled. A good day to explore the city!</p>
              ) : selectedDay.events.map((ev, i) => {
                const t = STAMP_THEMES[ev.type] || STAMP_THEMES.special;
                return (
                  <div key={ev.id || i} className="stamp-modal-row">
                    <span className="stamp-modal-dot" style={{ background: t.bg }} />
                    <div className="stamp-modal-ev-info">
                      <p className="stamp-modal-ev-title">
                        {ev.type === 'holiday' && <span style={{marginRight: 6}}>🇮🇳</span>}
                        {ev.title}
                        {ev.isNational && <span className="stamp-national-badge">National Holiday</span>}
                        {ev.isInternational && <span className="stamp-international-badge">International</span>}
                        {ev.isRegional && !ev.isNational && <span className="stamp-regional-badge">Regional Holiday</span>}
                      </p>
                      <p className="stamp-modal-ev-venue">
                        {ev.type === 'holiday' ? '🏛️' : '📍'} {ev.venue || displayName}
                      </p>
                      {ev.bookingLink && (
                        <a href={ev.bookingLink} target="_blank" rel="noopener noreferrer" className="stamp-modal-book-btn">
                          Book Tickets 🎟️
                        </a>
                      )}
                    </div>
                    <span
                      className="stamp-modal-type-tag"
                      style={{ background: t.bg, color: t.text }}
                    >
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
