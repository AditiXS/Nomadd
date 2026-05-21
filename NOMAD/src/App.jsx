import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import HyderabadIntro from './pages/HyderabadIntro';
import DelhiIntro from './pages/DelhiIntro';
import HyderabadPage from './pages/HyderabadPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro/hyderabad" element={<HyderabadIntro />} />
        <Route path="/intro/delhi" element={<DelhiIntro />} />
        <Route path="/city/:city" element={<HyderabadPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
