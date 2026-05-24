import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    interests: '',
    socialLink: '',
    designation: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
          socialLink: data.profile.socialLink || '',
          designation: data.profile.designation || 'nomad'
        });
        setAvatarFile(null);
        setAvatarPreview(null);
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
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    let avatarUrl = user.avatar;
    if (avatarFile) {
      // Convert file to Base64
      avatarUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(avatarFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
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
        setAvatarPreview(null);
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

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset form data to current user
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        age: user.age || '',
        interests: user.interests ? user.interests.join(', ') : '',
        socialLink: user.socialLink || '',
        designation: user.designation || 'nomad'
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="profile-loading">Loading Profile...</div>;

  const displayAvatar = avatarPreview || user?.avatar;
  const designation = (isEditing ? formData.designation : user?.designation) || 'nomad';
  const designationLabel = designation.charAt(0).toUpperCase() + designation.slice(1);

  return (
    <div className="profile-page-container">
      {/* Blurred Background */}
      <div
        className={`profile-bg-blur ${!displayAvatar ? 'profile-bg-blur-fallback' : ''}`}
        style={displayAvatar ? { backgroundImage: `url(${displayAvatar})` } : {}}
      />

      <button className="profile-back-btn" onClick={handleBack}>&larr; Back</button>

      <div className="profile-card-container">
        <div className="lined-paper-card">

          {/* Header: Polaroid + Title */}
          <div className="meet-the-header">
            <div className="polaroid-wrapper">
              <div className="paperclip" />
              <div className="polaroid-photo" onClick={() => isEditing && fileInputRef.current?.click()}>
                {displayAvatar ? (
                  <img src={displayAvatar} alt={user?.name || 'Profile'} />
                ) : (
                  <div className="polaroid-placeholder">
                    {(user?.name || 'N').charAt(0).toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <div className="polaroid-upload-overlay">📷 Change Photo</div>
                )}
                <span className="polaroid-name">
                  {isEditing ? formData.name || 'Your Name' : user?.name || 'Your Name'}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="meet-the-title">
              MEET THE<br />{designationLabel}
            </div>
          </div>

          {/* Name */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">NAME</div>
            {isEditing ? (
              <input
                className="inline-edit-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name..."
              />
            ) : (
              <div className={`profile-detail-value ${!user?.name ? 'empty' : ''}`}>
                {user?.name || 'Not set'}
              </div>
            )}
          </div>

          {/* Designation / Occupation */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">I AM A</div>
            {isEditing ? (
              <input
                className="inline-edit-input"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Nomad, Mover, Explorer..."
              />
            ) : (
              <div className={`profile-detail-value ${!designation ? 'empty' : ''}`}>
                {designationLabel}
              </div>
            )}
          </div>

          {/* Age */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">AGE</div>
            {isEditing ? (
              <input
                className="inline-edit-input"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
              />
            ) : (
              <div className={`profile-detail-value ${!user?.age ? 'empty' : ''}`}>
                {user?.age || 'Not set'}
              </div>
            )}
          </div>

          {/* About / Bio */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">ABOUT ME</div>
            {isEditing ? (
              <textarea
                className="inline-edit-textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the world about yourself..."
                rows={3}
              />
            ) : (
              <div className={`profile-detail-value ${!user?.bio ? 'empty' : ''}`}>
                {user?.bio || 'This nomad is mysterious. No bio yet!'}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">INTERESTS</div>
            {isEditing ? (
              <input
                className="inline-edit-input"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Coffee, Hiking, Photography..."
              />
            ) : (
              <div className="profile-tags-row">
                {user?.interests && user.interests.length > 0 ? (
                  user.interests.map((interest, i) => (
                    <span key={i} className="profile-tag">{interest}</span>
                  ))
                ) : (
                  <span className="profile-tag empty-tag">No interests added</span>
                )}
              </div>
            )}
          </div>

          {/* Social Link */}
          <div className="profile-detail-group">
            <div className="profile-detail-label">SOCIAL</div>
            {isEditing ? (
              <input
                className="inline-edit-input"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleChange}
                placeholder="Instagram / LinkedIn link..."
              />
            ) : (
              user?.socialLink ? (
                <a href={user.socialLink} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                  🌐 Connect
                </a>
              ) : (
                <div className="profile-detail-value empty">No link added</div>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
                <button className="profile-save-btn" onClick={handleSave}>Save Changes</button>
              </>
            ) : (
              <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
