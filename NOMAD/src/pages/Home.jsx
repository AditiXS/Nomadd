import React from 'react';
import Hero from '../components/Hero';
import MapIntro from '../components/MapIntro';
import MapSection from '../components/MapSection';
import FooterMarquee from '../components/FooterMarquee';

const Home = () => {
  return (
    <div className="app-container">
      <Hero />
      <MapIntro />
      <MapSection />
      <FooterMarquee />
    </div>
  );
};

export default Home;
