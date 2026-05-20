import React from 'react';
import './MapIntro.css';

const MapIntro = () => {
  return (
    <section className="map-intro-section">

      {/* Dark overlay */}
      <div className="map-intro-overlay" />

      {/* Text content */}
      <div className="map-intro-inner">
        <p className="map-intro-eyebrow">— NOMAD —</p>
        <h2 className="map-intro-heading">आप किसे अपना घर कहेंगे ?</h2>
        <p className="map-intro-subtext">
          Every state has a story. Every city has a soul.<br />
          Find yours on NOMAD.
        </p>
      </div>

    </section>
  );
};

export default MapIntro;
