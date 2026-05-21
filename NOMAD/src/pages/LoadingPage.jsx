import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoadingPage.css';

const LoadingPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out shortly before 10s
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 9500);

    // Redirect at exactly 10s
    const redirectTimer = setTimeout(() => {
      navigate(`/city/${city}`);
    }, 10000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [city, navigate]);

  return (
    <div className={`loading-screen ${fade ? 'fade-out' : ''}`}>
      <div className="loader-content">
        {city.toLowerCase() === 'hyderabad' ? (
          <div className="loader-generic">
            <h2 className="loading-text">arriving at Hyderabad...</h2>
            <p className="loading-subtext">preparing your city experience</p>
          </div>
        ) : city.toLowerCase() === 'delhi' ? (
          <div className="loader-generic">
            <h2 className="loading-text">arriving at Delhi...</h2>
            <p className="loading-subtext">preparing your capital city experience</p>
          </div>
        ) : (
          <h2 className="loading-text">loading {city}...</h2>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
