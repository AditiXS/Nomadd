import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HyderabadIntro.css';

const HyderabadIntro = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Dramatic, rapid-fire full-screen sequence
        const t1 = setTimeout(() => setStep(1), 100);  // Hyd hits full screen
        const t2 = setTimeout(() => setStep(2), 2000); // Dancing flies in full screen
        const t3 = setTimeout(() => setStep(3), 3500); // Human drops in full screen
        const t4 = setTimeout(() => setStep(4), 5000); // Text slams down
        
        // Final fade out
        const t5 = setTimeout(() => setFade(true), 8000); 
        // Navigate
        const t6 = setTimeout(() => navigate('/city/hyderabad'), 9000);

        return () => { 
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); 
            clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); 
        };
    }, [navigate]);

    return (
        <div className={`dynamic-sequence-bg ${fade ? 'fade-out' : ''}`}>
            {step >= 1 && (
                <div className="full-layer drop-from-top">
                    <img src="/hyd.png" alt="Hyderabad" className="full-image" />
                </div>
            )}
            {step >= 2 && (
                <div className="full-layer slide-from-left">
                    <img src="/dancing.jpg" alt="Dancing" className="full-image" />
                </div>
            )}
            {step >= 3 && (
                <div className="full-layer drop-from-right">
                    <img src="/hyd/human.png" alt="Human" className="full-image" />
                </div>
            )}
            
            {step >= 4 && (
                <div className="full-layer text-slam-layer">
                    <h1 className="epic-intro-text">namaskaram<br/>hyderabad</h1>
                </div>
            )}
        </div>
    );
};

export default HyderabadIntro;
