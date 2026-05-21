import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';
import './LoginPage.css';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', idType: 'aadhaar', idNumber: '', phone: '', otp: '', designation: 'nomad'
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '', otp: '', newPassword: '' });
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const timerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    if (!signupData.email || !signupData.email.includes('@')) {
      alert('please enter a valid email address.');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpTimer(60);

    try {
      const res = await fetch(`${API_BASE}/api/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        console.log('real otp sent via email!');
        alert(`OTP sent successfully to ${signupData.email}`);
      } else {
        alert(`Could not send real Email (check .env for EMAIL_USER and EMAIL_PASS).\n\n[DEMO MODE] Your OTP is: ${otp}`);
        console.log(`[demo fallback] your otp is: ${otp}`);
        setSignupData(prev => ({ ...prev, otp }));
      }
    } catch (err) {
      alert(`Backend server not running.\n\n[DEMO MODE] Your OTP is: ${otp}`);
      console.log(`[demo fallback] your otp is: ${otp}`);
      setSignupData(prev => ({ ...prev, otp }));
    }
  };

  const handleVerifyOtp = () => {
    if (signupData.otp === generatedOtp) setOtpVerified(true);
    else alert('incorrect otp. please try again.');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Save user details including designation in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        const city = searchParams.get('city');
        if (city) {
          navigate(`/city/${city}`);
        } else {
          navigate('/');
        }
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (err) {
      alert('Network error connecting to backend.');
      console.error(err);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) { alert('please verify your email address first.'); return; }

    if (!/^[A-Z](?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(signupData.password)) {
      alert('Password must be at least 8 characters long, start with a capital letter, and contain at least one number and one special character.');
      return;
    }

    const idVal = signupData.idNumber;
    switch (signupData.idType) {
      case 'aadhaar':
        if (!/^\d{12}$/.test(idVal)) { alert('Aadhaar must be exactly 12 digits.'); return; }
        break;
      case 'pan':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(idVal)) { alert('PAN must be exactly 10 valid format characters.'); return; }
        break;
      case 'passport':
        if (!/^[A-Z0-9]{7,9}$/i.test(idVal)) { alert('Passport must be 7-9 alphanumeric characters.'); return; }
        break;
      case 'voterid':
        if (!/^[A-Z]{3}\d{7}$/i.test(idVal)) { alert('Voter ID must be 3 letters followed by 7 digits.'); return; }
        break;
    }

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Save user details including designation in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          designation: signupData.designation
        }));
        const city = searchParams.get('city');
        if (city) {
          navigate(`/city/${city}`);
        } else {
          navigate('/');
        }
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (err) {
      alert('Network error connecting to backend.');
      console.error(err);
    }
  };

  const handleSendForgotOtp = async () => {
    if (!forgotPasswordData.email || !forgotPasswordData.email.includes('@')) {
      alert('please enter a valid email address.');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpTimer(60);

    try {
      const res = await fetch(`${API_BASE}/api/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordData.email, otp })
      });
      const data = await res.json();
      if (data.success) {
        alert(`OTP sent successfully to ${forgotPasswordData.email}`);
      } else {
        alert(`Could not send real Email.\n\n[DEMO MODE] Your OTP is: ${otp}`);
        setForgotPasswordData(prev => ({ ...prev, otp }));
      }
    } catch (err) {
      alert(`Backend server not running.\n\n[DEMO MODE] Your OTP is: ${otp}`);
      setForgotPasswordData(prev => ({ ...prev, otp }));
    }
  };

  const handleVerifyForgotOtp = () => {
    if (forgotPasswordData.otp === generatedOtp) setOtpVerified(true);
    else alert('incorrect otp. please try again.');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return;
    
    if (!/^[A-Z](?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(forgotPasswordData.newPassword)) {
      alert('Password must be at least 8 characters long, start with a capital letter, and contain at least one number and one special character.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordData.email, newPassword: forgotPasswordData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert('Password updated successfully! You can now log in.');
        setTab('login');
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        alert(`Failed to reset password: ${data.message}`);
      }
    } catch (err) {
      alert('Network error connecting to backend.');
    }
  };

  return (
    <div className={`postcard-bg ${visible ? 'fade-in' : ''}`}>

      <button className="back-btn" onClick={() => navigate('/')}>← back</button>

      {/* Stamp-shaped card */}
      <div className={`postcard-card ${visible ? 'slide-up' : ''}`}>

        {/* Form lives inside the white stamp area */}
        <div className="stamp-form-inner">

          <p className="postcard-label-top">post card from</p>
          <h1 className="postcard-brand">nomad</h1>

          {/* Tabs */}
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>login</button>
            <button className={`tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>sign up</button>
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-field">
                <label>email :</label>
                <input type="email" placeholder="your@email.com" value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>password :</label>
                <input type="password" placeholder="••••••••" value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
              </div>
              <button type="submit" className="send-btn" style={{marginTop: '6px'}}>
                <span className="seal" /> send →
              </button>
              <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '4px'}}>
                <button type="button" onClick={() => { setTab('forgot'); setOtpSent(false); setOtpVerified(false); }} style={{background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: 'Courier New', textDecoration: 'underline', fontSize: '0.85rem', padding: 0}}>
                  forgot password?
                </button>
              </div>
            </form>
          )}

          {/* ── SIGN UP ── */}
          {tab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="form-field">
                <label>name :</label>
                <input type="text" placeholder="your full name" value={signupData.name}
                  onChange={e => setSignupData({ ...signupData, name: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>email :</label>
                <div className="phone-input-group">
                  <input type="email" placeholder="your@email.com" value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })} required />
                  <button type="button" className="otp-btn" onClick={handleSendOtp} disabled={otpTimer > 0}>
                    {otpTimer > 0 ? `resend (${otpTimer}s)` : 'get otp'}
                  </button>
                </div>
              </div>
              {otpSent && !otpVerified && (
                <div className="form-field">
                  <label>otp :</label>
                  <div className="otp-input-group">
                    <input type="text" placeholder="6-digit otp" maxLength={6} value={signupData.otp}
                      onChange={e => setSignupData({ ...signupData, otp: e.target.value })} />
                    <button type="button" className="verify-btn" onClick={handleVerifyOtp}>verify</button>
                  </div>
                </div>
              )}
              {otpVerified && <p className="verified-badge">✓ email verified</p>}
              <div className="form-field">
                <label>password :</label>
                <input type="password" placeholder="••••••••" value={signupData.password}
                  onChange={e => setSignupData({ ...signupData, password: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>designation :</label>
                <select className="vintage-select" value={signupData.designation}
                  onChange={e => setSignupData({ ...signupData, designation: e.target.value })}>
                  <option value="nomad">nomad (moving to this city)</option>
                  <option value="local">local (already living here)</option>
                </select>
              </div>
              <div className="form-field">
                <label>id proof :</label>
                <select className="vintage-select" value={signupData.idType}
                  onChange={e => setSignupData({ ...signupData, idType: e.target.value })}>
                  <option value="aadhaar">aadhaar</option>
                  <option value="pan">pan card</option>
                  <option value="passport">passport</option>
                  <option value="voterid">voter id</option>
                </select>
              </div>
              <div className="form-field">
                <label>id number :</label>
                <input type="text" placeholder={`enter ${signupData.idType} number`} value={signupData.idNumber}
                  onChange={e => setSignupData({ ...signupData, idNumber: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>phone :</label>
                <div className="phone-input-group">
                  <span className="phone-prefix">+91</span>
                  <input type="tel" placeholder="9876543210" maxLength={10} value={signupData.phone}
                    onChange={e => setSignupData({ ...signupData, phone: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="send-btn">
                <span className="seal" /> join nomad →
              </button>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {tab === 'forgot' && (
            <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
              <p style={{fontFamily: 'Courier New', fontSize: '0.75rem', color: '#555', marginBottom: '8px', lineHeight: '1.2'}}>
                enter your registered email to reset your password.
              </p>
              <div className="form-field">
                <label>email :</label>
                <div className="phone-input-group">
                  <input type="email" placeholder="your@email.com" value={forgotPasswordData.email}
                    onChange={e => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })} required />
                  <button type="button" className="otp-btn" onClick={handleSendForgotOtp} disabled={otpTimer > 0}>
                    {otpTimer > 0 ? `resend (${otpTimer}s)` : 'get otp'}
                  </button>
                </div>
              </div>
              {otpSent && !otpVerified && (
                <div className="form-field">
                  <label>otp :</label>
                  <div className="otp-input-group">
                    <input type="text" placeholder="6-digit otp" maxLength={6} value={forgotPasswordData.otp}
                      onChange={e => setForgotPasswordData({ ...forgotPasswordData, otp: e.target.value })} />
                    <button type="button" className="verify-btn" onClick={handleVerifyForgotOtp}>verify</button>
                  </div>
                </div>
              )}
              {otpVerified && <p className="verified-badge">✓ email verified</p>}
              {otpVerified && (
                <div className="form-field">
                  <label>new password :</label>
                  <input type="password" placeholder="••••••••" value={forgotPasswordData.newPassword}
                    onChange={e => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })} required />
                </div>
              )}
              <button type="submit" className="send-btn" disabled={!otpVerified} style={{marginTop: '6px'}}>
                <span className="seal" /> reset password →
              </button>
              <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '4px'}}>
                <button type="button" onClick={() => { setTab('login'); setOtpVerified(false); setOtpSent(false); }} style={{background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: 'Courier New', textDecoration: 'underline', fontSize: '0.85rem', padding: 0}}>
                  back to login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
