import React from 'react';
import './FooterMarquee.css';

const FooterMarquee = () => {
  const stamps = [
    '/stamp1.jpg',
    '/stamp2.jpg',
    '/stamp3.jpg',
    '/stamp4.jpg',
    '/stamp5.jpg',
    '/stamp6.jpg',
    '/stamp7.jpg',
    '/stamp8.jpg',
    '/stamp9.jpg',
    '/stamp9 (1).jpg',
    '/stamp9 (2).jpg',
    '/stamp9 (3).jpg'
  ];

  // Double the array for seamless scrolling
  const list = [...stamps, ...stamps];

  return (
    <div className="footer-marquee-container">
      <div className="marquee-track">
        {list.map((src, idx) => (
          <div key={idx} className="stamp-item">
            <img src={src} alt={`Stamp ${idx}`} className="marquee-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterMarquee;
