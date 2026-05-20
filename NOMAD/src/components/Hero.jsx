import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const slices = [
    { letter: 'n', bg: '/fourth.jpg' },
    { letter: 'o', bg: '/third.jpg' },
    { letter: 'm', bg: '/mumbai.jpg' },
    { letter: 'a', bg: '/second.jpg?v=2' },
    { letter: 'd', bg: '/Dehradun.jpg?v=2' }
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="hero-section">
      <div className="hero-slices-container">
        {slices.map((slice, index) => (
          <div
            key={index}
            className={`hero-slice ${hoveredIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ backgroundImage: `url(${slice.bg})` }}
          >
            <div className="slice-overlay"></div>
            <h1 className="hero-letter">{slice.letter}</h1>
          </div>
        ))}
      </div>
      <div className="hindi-subtitle">बंजारा</div>
    </section>
  );
};

export default Hero;
