import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    interests: '',
    socialLink: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser.email);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchProfile = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/profile/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setFormData({
          name: data.profile.name || '',
          bio: data.profile.bio || '',
          age: data.profile.age || '',
          interests: data.profile.interests ? data.profile.interests.join(', ') : '',
          socialLink: data.profile.socialLink || ''
        });
        setAvatarFile(null); // Reset file input
        // Update user session with latest data just in case
        const updatedUser = { ...JSON.parse(sessionStorage.getItem('user')), ...data.profile };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    let avatarUrl = user.avatar;
    if (avatarFile) {
      const form = new FormData();
      form.append('avatar', avatarFile);
      try {
        const uploadRes = await fetch(`${API_BASE}/api/upload-avatar`, {
          method: 'POST',
          body: form
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          avatarUrl = `${API_BASE}${uploadData.filePath}`;
        } else {
          alert('Failed to upload image');
          return;
        }
      } catch (err) {
        alert('Error uploading image');
        return;
      }
    }

    try {
      const payload = { ...formData, avatar: avatarUrl };
      const res = await fetch(`${API_BASE}/api/user/profile/${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        const updatedUser = { ...user, ...data.profile };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert('Failed to save profile: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return <div className="profile-loading">Loading Profile...</div>;

  return (
    <div className="profile-page-container">
      <button className="profile-back-btn" onClick={handleBack}>&larr; Back</button>
      
      <div className="profile-card-container">
        {!isEditing ? (
          <div className="tinder-profile-card">
            <div className="tinder-profile-image-container">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="tinder-profile-image" />
              ) : (
                <div className="tinder-profile-image-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="tinder-profile-overlay">
                <h1 className="tinder-profile-name">
                  {user.name} {user.age && <span className="tinder-profile-age">{user.age}</span>}
                </h1>
                <p className="tinder-profile-designation">{user.designation || 'Nomad'}</p>
              </div>
            </div>
            <div className="tinder-profile-content">
              <div className="tinder-profile-section">
                <h3>About Me</h3>
                <p>{user.bio || 'This nomad is mysterious. No bio yet!'}</p>
              </div>
              <div className="tinder-profile-section">
                <h3>Interests</h3>
                <div className="tinder-profile-tags">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, i) => (
                      <span key={i} className="tinder-interest-tag">{interest}</span>
                    ))
                  ) : (
                    <span className="tinder-interest-tag empty">No interests added</span>
                  )}
                </div>
              </div>
              {user.socialLink && (
                <div className="tinder-profile-section">
                  <a href={user.socialLink} target="_blank" rel="noopener noreferrer" className="tinder-social-link">
                    🌐 Connect / Social
                  </a>
                </div>
              )}
              <button className="tinder-edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="tinder-profile-edit">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25" />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={4} />
              </div>
              <div className="form-group">
                <label>Interests (comma separated)</label>
                <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Coffee, Hiking, React" />
              </div>
              <div className="form-group">
                <label>Social Link</label>
                <input type="text" name="socialLink" value={formData.socialLink} onChange={handleChange} placeholder="Insta/LinkedIn link" />
              </div>
              <div className="profile-edit-actions">
                <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="profile-save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
