import React from 'react';
import './IndiaMap.css';

const IndiaMap = () => {
  const handleCityClick = (city, e) => {
    e.stopPropagation();
    alert(`Clicked on ${city}. This will redirect to Login/Signup page shortly!`);
  };

  const cities = [
    { name: 'Delhi', cls: 'pin-delhi', color: '#e63946' }, // red
    { name: 'Mumbai', cls: 'pin-mumbai', color: '#fca311' }, // orange
    { name: 'Bangalore', cls: 'pin-bangalore', color: '#2a9d8f' }, // teal
    { name: 'Chennai', cls: 'pin-chennai', color: '#e76f51' }, // coral
    { name: 'Kolkata', cls: 'pin-kolkata', color: '#264653' }, // dark slate
    { name: 'Jaipur', cls: 'pin-jaipur', color: '#d62828' }, // bright red
    { name: 'Ahmedabad', cls: 'pin-ahmedabad', color: '#f4a261' }, // soft orange
    { name: 'Pune', cls: 'pin-pune', color: '#9b5de5' }, // purple
    { name: 'Hyderabad', cls: 'pin-hyderabad', color: '#00f5d4' }, // cyan
    { name: 'Kochi', cls: 'pin-kochi', color: '#8ac926' }, // lime green
    { name: 'Varanasi', cls: 'pin-varanasi', color: '#ff006e' }, // pink
    { name: 'Goa', cls: 'pin-goa', color: '#fee440' }, // yellow
    { name: 'Shimla', cls: 'pin-shimla', color: '#00bbf9' } // light blue
  ];

  return (
    <div className="map-container">
      {/* Visual layer: Full screen background pins */}
      <div className="map-visual-layer">
         {cities.map((city) => (
           <div 
             key={city.name}
             className={`city-pin ${city.cls}`} 
             style={{ backgroundColor: city.color, boxShadow: `0 0 0 5px ${city.color}66, 0 5px 10px rgba(0,0,0,0.3)` }}
             onClick={(e) => handleCityClick(city.name, e)}
           >
             <span className="city-label" style={{ backgroundColor: city.color }}>{city.name}</span>
           </div>
         ))}
      </div>

      {/* Content layer: Text overlaid on the map */}
      <div className="map-text-content">
        <h1 className="hero-title">Welcoming India</h1>
        <p className="hero-subtitle">Choose your destination and begin your NOMAD journey</p>
      </div>
    </div>
  );
};
export default IndiaMap;
