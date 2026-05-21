import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HyderabadIntro.css';

const DELHI_HERO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/India_Gate_in_New_Delhi_03-2016_img3.jpg/1280px-India_Gate_in_New_Delhi_03-2016_img3.jpg';
const RED_FORT = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Red_Fort_in_Delhi_03-2016.jpg/1280px-Red_Fort_in_Delhi_03-2016.jpg';
const DelhiIntro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 3500);
    const t4 = setTimeout(() => setStep(4), 5000);
    const t5 = setTimeout(() => setFade(true), 8000);
    const t6 = setTimeout(() => navigate('/city/delhi'), 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [navigate]);

  return (
    <div className={`dynamic-sequence-bg ${fade ? 'fade-out' : ''}`}>
      {step >= 1 && (
        <div className="full-layer drop-from-top">
          <img src={DELHI_HERO} alt="India Gate, Delhi" className="full-image" />
        </div>
      )}
      {step >= 2 && (
        <div className="full-layer slide-from-left">
          <img src="/dancing.jpg" alt="Delhi culture" className="full-image" />
        </div>
      )}
      {step >= 3 && (
        <div className="full-layer drop-from-right">
          <img src={RED_FORT} alt="Red Fort" className="full-image" />
        </div>
      )}
      {step >= 4 && (
        <div className="full-layer text-slam-layer">
          <h1 className="epic-intro-text">namaste<br />delhi</h1>
        </div>
      )}
    </div>
  );
};

export default DelhiIntro;
