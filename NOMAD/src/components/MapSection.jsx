import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { indiaData } from './IndiaPaths';
import './MapSection.css';

const MapSection = () => {
  const [tooltip, setTooltip] = useState(null);
  const navigate = useNavigate();

  const colors = ['#e63946', '#fca311', '#2a9d8f', '#e76f51', '#9b5de5', '#00f5d4', '#fee440', '#ff006e', '#00bbf9'];

  return (
    <section className="map-section">
      <div className="map-canvas">
        {tooltip && (
          <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.label}
          </div>
        )}
        <svg
          viewBox="0 1 760 800"
          className="india-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {indiaData.map((state, index) => (
            <path
              key={state.id}
              id={state.id}
              d={state.d}
              className="state-path"
              style={{ '--hover-color': colors[index % colors.length] }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.closest('svg').getBoundingClientRect();
                setTooltip({
                  label: state.label,
                  x: e.clientX - rect.left + 12,
                  y: e.clientY - rect.top - 8,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => {
                const destination = state.label === 'Telangana' ? 'hyderabad' : state.label.toLowerCase();
                navigate(`/login?city=${encodeURIComponent(destination)}`);
              }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
};

export default MapSection;

