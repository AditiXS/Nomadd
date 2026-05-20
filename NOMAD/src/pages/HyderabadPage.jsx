import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventCalendar from '../components/EventCalendar';
import './HyderabadPage.css';

const HyderabadPage = () => {
  const navigate = useNavigate();
  const { city } = useParams();
  const cityName = city || 'hyderabad';
  const displayName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        if (u.name) {
          setAuthorName(u.name);
          setReviewForm(prev => ({ ...prev, name: u.name }));
          setCarpoolForm(prev => ({ ...prev, name: u.name }));
        }
      } catch (e) {
        console.error('Failed to parse current user from sessionStorage', e);
      }
    }
  }, []);

  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState([]);
  const [foods, setFoods] = useState([]);
  const [events, setEvents] = useState([]);
  const [transport, setTransport] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [posting, setPosting] = useState(false);
  const [activeSection, setActiveSection] = useState('places');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTransport, setLoadingTransport] = useState(true);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ restaurant: '', name: '', stars: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewOpenFor, setReviewOpenFor] = useState(null); // restaurant id

  // Fare estimator state
  const [fareLocations, setFareLocations] = useState([]);
  const [fareOrigin, setFareOrigin] = useState(null);
  const [fareDest, setFareDest] = useState(null);
  const [fareOriginSearch, setFareOriginSearch] = useState('');
  const [fareDestSearch, setFareDestSearch] = useState('');
  const [fareResults, setFareResults] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Carpool state
  const [carpoolPosts, setCarpoolPosts] = useState([]);
  const [carpoolForm, setCarpoolForm] = useState({ name: '', origin: '', destination: '', date: '', time: '', seats: 1, note: '' });
  const [carpoolPosting, setCarpoolPosting] = useState(false);

  // Accommodations state
  const [accommodations, setAccommodations] = useState([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState(true);
  const [accFilterType, setAccFilterType] = useState('All');
  const [accFilterPrice, setAccFilterPrice] = useState('All');
  const [accFilterFurnishing, setAccFilterFurnishing] = useState('All');

  const sections = ['places', 'food', 'events', 'transport', 'accommodations', 'community'];
  const heroRef = useRef(null);

  // Relevant Wikimedia Commons event images by type
  const EVENT_TYPE_IMAGES = {
    performance: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bharatnatyam_Performance.jpg/640px-Bharatnatyam_Performance.jpg',
    food:        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    holiday:     'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Diwali_2012_-_Celebrating_Diwali_in_India.jpg/640px-Diwali_2012_-_Celebrating_Diwali_in_India.jpg',
    special:     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2010_Sukhbaatar_Square_Naadam_Opening_Ceremony.jpg/640px-2010_Sukhbaatar_Square_Naadam_Opening_Ceremony.jpg',
    cultural:    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bharatnatyam_Performance.jpg/640px-Bharatnatyam_Performance.jpg',
    music:       'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Canned_Heat_at_Woodstock.jpg/640px-Canned_Heat_at_Woodstock.jpg',
    sports:      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Cricket_fielding.jpg/640px-Cricket_fielding.jpg',
    festival:    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/India_-_Varanasi_festival_-_3496.jpg/640px-India_-_Varanasi_festival_-_3496.jpg',
  };

  // Fallback pool of real Wikimedia Commons event/festival images
  const EVENT_FALLBACK_POOL = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/India_-_Varanasi_festival_-_3496.jpg/640px-India_-_Varanasi_festival_-_3496.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bharatnatyam_Performance.jpg/640px-Bharatnatyam_Performance.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2010_Sukhbaatar_Square_Naadam_Opening_Ceremony.jpg/640px-2010_Sukhbaatar_Square_Naadam_Opening_Ceremony.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Crowded_street_-_geograph.org.uk_-_1002342.jpg/640px-Crowded_street_-_geograph.org.uk_-_1002342.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Canned_Heat_at_Woodstock.jpg/640px-Canned_Heat_at_Woodstock.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Diwali_2012_-_Celebrating_Diwali_in_India.jpg/640px-Diwali_2012_-_Celebrating_Diwali_in_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Ganesh_Chaturthi_at_Lalbaug.jpg/640px-Ganesh_Chaturthi_at_Lalbaug.jpg',
  ];

  const getEventImage = (event, index) => {
    // 1. Use event's own image if provided by the API
    if (event.image) return event.image;
    // 2. Match by event type
    const type = (event.type || '').toLowerCase();
    const title = (event.title || '').toLowerCase();
    if (EVENT_TYPE_IMAGES[type]) return EVENT_TYPE_IMAGES[type];
    // 3. Keyword match in title
    if (title.includes('food') || title.includes('biryani') || title.includes('festival of food')) return EVENT_TYPE_IMAGES.food;
    if (title.includes('music') || title.includes('concert') || title.includes('band')) return EVENT_TYPE_IMAGES.music;
    if (title.includes('cultural') || title.includes('dance') || title.includes('art')) return EVENT_TYPE_IMAGES.cultural;
    if (title.includes('festival') || title.includes('mela') || title.includes('fair')) return EVENT_TYPE_IMAGES.festival;
    if (title.includes('sport') || title.includes('cricket') || title.includes('marathon')) return EVENT_TYPE_IMAGES.sports;
    if (title.includes('holiday') || title.includes('diwali') || title.includes('eid') || title.includes('holi')) return EVENT_TYPE_IMAGES.holiday;
    // 4. Cycle through fallback pool
    return EVENT_FALLBACK_POOL[index % EVENT_FALLBACK_POOL.length];
  };

  const categoryEmojis = {
    'Museum': '🏛️', 'Attraction': '🏰', 'Park': '🌿',
    'Heritage Fort': '🏯', 'Temple': '🛕', 'Lake': '🌊', 'default': '📍'
  };

  const placeImageFallbacks = {
    'charminar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/330px-Charminar_Hyderabad_1.jpg',
    'golconda fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/330px-Golconda_Fort_005.jpg',
    'hussain sagar lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HussainSagar_Moon_Rise.jpg/330px-HussainSagar_Moon_Rise.jpg',
    'ramoji film city': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ramoji_Film_City.jpg/330px-Ramoji_Film_City.jpg',
    'salar jung museum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg/330px-Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg',
    'birla mandir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Birla_Mandir%2C_Hyderabad.png/330px-Birla_Mandir%2C_Hyderabad.png',
    'chowmahalla palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chowmahalla_Palace_01.jpg/330px-Chowmahalla_Palace_01.jpg',
    'nehru zoological park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Hyderabad_zoo.jpg/330px-Hyderabad_zoo.jpg'
  };

  const getPlaceFallbackImage = (place, index) => {
    const fallbackImages = Object.values(placeImageFallbacks);
    return placeImageFallbacks[(place?.name || '').toLowerCase()] || fallbackImages[index % fallbackImages.length];
  };

  const getPlaceImage = (place, index) => {
    const key = (place?.name || '').toLowerCase();
    return placeImageFallbacks[key] || place?.image || getPlaceFallbackImage(place, index);
  };

  const foodImageMap = {
    'hyderabadi biryani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Biryani.jpg/640px-Biryani.jpg',
    'haleem': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ramzan_food_%2843%29.jpg/640px-Ramzan_food_%2843%29.jpg',
    'double ka meetha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bread_pudding_-_Aubry%27s_Orleans.jpg/640px-Bread_pudding_-_Aubry%27s_Orleans.jpg',
    'irani chai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cup-of-tea.jpg/640px-Cup-of-tea.jpg',
    'qubani ka meetha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Peaches_and_plums.jpg/640px-Peaches_and_plums.jpg',
    'lukhmi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Samosa_%28238609264%29.jpg/640px-Samosa_%28238609264%29.jpg',
    'vada pav': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Vada_Pav.jpg/640px-Vada_Pav.jpg',
    'pav bhaji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pav_bhaji.jpg/640px-Pav_bhaji.jpg',
    'pani puri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Panipuri.jpg/640px-Panipuri.jpg',
    'bombay sandwich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Masala_Dosa_-_Udupi_Hotel.jpg/640px-Masala_Dosa_-_Udupi_Hotel.jpg'
  };

  const getFoodFallbackImage = (foodName) => {
    if (!foodName) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg';
    const key = foodName.toLowerCase();
    return foodImageMap[key] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg';
  };

  const getFoodFallbackData = (city) => {
    const base = [
      { id: 'f1', name: 'Hyderabadi Biryani', type: 'Local Famous', description: 'World-famous slow-cooked basmati rice with marinated meat, spices, and saffron.', must_try_at: 'Paradise, Pista House, Shah Ghouse', price_range: 'Moderate', avg_rating: 4.8 },
      { id: 'f2', name: 'Haleem', type: 'Specialty', description: 'A rich, savory stew of pounded meat, lentils, and wheat, slow-cooked for hours.', must_try_at: 'Pista House, Cafe 555', price_range: 'Moderate', avg_rating: 4.9 },
      { id: 'f3', name: 'Double Ka Meetha', type: 'Dessert', description: 'Traditional bread pudding dessert made with fried bread slices soaked in hot milk with saffron.', must_try_at: 'Karachi Bakery, Nimrah Cafe', price_range: 'Low', avg_rating: 4.6 },
      { id: 'f4', name: 'Irani Chai', type: 'Street Food', description: 'Iconic thick milky tea served alongside buttery Osmania biscuits.', must_try_at: 'Nimrah Cafe, Niloufer Cafe', price_range: 'Low', avg_rating: 4.7 },
      { id: 'f5', name: 'Qubani Ka Meetha', type: 'Dessert', description: 'Traditional Hyderabadi dessert of stewed apricots topped with fresh cream.', must_try_at: 'Hotel Shadab, Paradise', price_range: 'Low', avg_rating: 4.5 },
      { id: 'f6', name: 'Lukhmi', type: 'Street Food', description: 'Flaky pastry pockets stuffed with spiced minced meat — the Hyderabadi samosa.', must_try_at: 'Old City, Charminar area', price_range: 'Low', avg_rating: 4.6 }
    ];
    return base.map((food) => ({ ...food, image: getFoodFallbackImage(food.name) }));
  };

  useEffect(() => {
    fetch(`http://localhost:3001/api/weather/${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setWeather(d.weather); }).catch(() => {});

    setLoadingPlaces(true);
    fetch(`http://localhost:3001/api/places/${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setPlaces(d.places); }).catch(() => {}).finally(() => setLoadingPlaces(false));

    setLoadingFoods(true);
    fetch(`http://localhost:3001/api/foods/${cityName}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.foods) && d.foods.length > 0) {
          setFoods(d.foods.map((food) => ({ ...food, image: food.image || getFoodFallbackImage(food.name) })));
        } else {
          setFoods(getFoodFallbackData(cityName));
        }
      })
      .catch(() => { setFoods(getFoodFallbackData(cityName)); })
      .finally(() => setLoadingFoods(false));

    setLoadingEvents(true);
    const now = new Date();
    fetch(`http://localhost:3001/api/events/${cityName}?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .then(r => r.json()).then(d => { if (d.success) setEvents(d.events); }).catch(() => {}).finally(() => setLoadingEvents(false));

    setLoadingTransport(true);
    fetch(`http://localhost:3001/api/transport/${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setTransport(d); }).catch(() => {}).finally(() => setLoadingTransport(false));

    fetchPosts();
    fetchCarpoolPosts();

    // Fetch fare estimator locations
    fetch(`http://localhost:3001/api/transport/${cityName}/locations`)
      .then(r => r.json()).then(d => { if (d.success) setFareLocations(d.locations); }).catch(() => {});

    // Fetch accommodations
    setLoadingAccommodations(true);
    fetch(`http://localhost:3001/api/accommodations/${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setAccommodations(d.accommodations); }).catch(() => {}).finally(() => setLoadingAccommodations(false));
  }, [cityName]);

  const fetchPosts = () => {
    fetch(`http://localhost:3001/api/community/posts?city=${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setPosts(d.posts); }).catch(() => {});
  };

  const fetchCarpoolPosts = () => {
    fetch(`http://localhost:3001/api/carpool/posts?city=${cityName}`)
      .then(r => r.json()).then(d => { if (d.success) setCarpoolPosts(d.posts); }).catch(() => {});
  };

  const handleEstimateFare = async () => {
    if (!fareOrigin || !fareDest) return;
    setFareLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/transport/estimate-fare', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: fareOrigin.lat, originLon: fareOrigin.lon,
          destLat: fareDest.lat, destLon: fareDest.lon,
          originName: fareOrigin.name, destName: fareDest.name
        })
      });
      const data = await res.json();
      if (data.success) setFareResults(data);
    } catch (err) {}
    setFareLoading(false);
  };

  const handleCarpoolPost = async (e) => {
    e.preventDefault();
    const { name, origin, destination, date, time, seats } = carpoolForm;
    if (!name.trim() || !origin.trim() || !destination.trim() || !date || !time) return;
    setCarpoolPosting(true);
    try {
      const res = await fetch('http://localhost:3001/api/carpool/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, author_name: name, origin, destination, travel_date: date, travel_time: time, seats: parseInt(seats) || 1, note: carpoolForm.note })
      });
      const data = await res.json();
      if (data.success) {
        setCarpoolForm({ name: '', origin: '', destination: '', date: '', time: '', seats: 1, note: '' });
        fetchCarpoolPosts();
      }
    } catch (err) {}
    setCarpoolPosting(false);
  };

  const filteredOriginLocs = fareLocations.filter(l => l.name.toLowerCase().includes(fareOriginSearch.toLowerCase()));
  const filteredDestLocs = fareLocations.filter(l => l.name.toLowerCase().includes(fareDestSearch.toLowerCase()));

  const handlePost = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !postContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('http://localhost:3001/api/community/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, author_name: authorName, content: postContent })
      });
      const data = await res.json();
      if (data.success) { setPostContent(''); fetchPosts(); }
    } catch (err) {}
    setPosting(false);
  };

  const handleReviewSubmit = async (restaurantName) => {
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityName, restaurant_name: restaurantName,
          user_name: reviewForm.name, stars: reviewForm.stars, review_text: reviewForm.text
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewForm({ restaurant: '', name: '', stars: 5, text: '' });
        setReviewOpenFor(null);
        // Refresh foods to get updated reviews
        fetch(`http://localhost:3001/api/foods/${cityName}`)
          .then(r => r.json()).then(d => { if (d.success) setFoods(d.foods); }).catch(() => {});
      }
    } catch (err) {}
    setSubmittingReview(false);
  };

  const weatherIcon = (desc) => {
    const d = (desc || '').toLowerCase();
    if (d.includes('sun') || d.includes('clear')) return '☀️';
    if (d.includes('cloud')) return '⛅';
    if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
    if (d.includes('thunder')) return '⛈️';
    if (d.includes('fog') || d.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const timeAgo = (ts) => {
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatEventDate = (dateStr) => {
    try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
    catch { return dateStr; }
  };

  const StarPicker = ({ value, onChange }) => (
    <div className="star-picker">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star-pick ${s <= value ? 'star-active' : ''}`} onClick={() => onChange(s)}>★</span>
      ))}
    </div>
  );

  return (
    <div className="city-page">
      {/* HEADER */}
      <div className="city-gallery-header">
        <div className="header-branding">
          <span className="brand-nomad">NOMAD</span>
          <span className="brand-city">{cityName.toLowerCase()}</span>
        </div>
        {currentUser && (
          <div className="header-user-badge">
            <span className={`user-tag ${currentUser.designation}`}>
              {currentUser.designation === 'nomad' ? 'Nomad ✈️' : 'Local 🏠'}
            </span>
          </div>
        )}
        {weather && (
          <div className="header-weather-pill">
            <span>{weatherIcon(weather.description)}</span>
            <span>{weather.temp_c}°C</span>
            <span className="weather-desc">{weather.description}</span>
          </div>
        )}
        <nav className="header-nav">
          {sections.map(s => (
            <button key={s} className={`nav-link ${activeSection === s ? 'active' : ''}`} onClick={() => setActiveSection(s)}>{s}</button>
          ))}
        </nav>
      </div>

      {/* HERO */}
      <div className="city-hero" ref={heroRef}>
        <div className="city-hero-layered-collage">
          <img src="/hyd/Untitled (1).png" alt="" className="layered-img img-1" />
          <img src="/hyd/Untitled.png" alt="" className="layered-img img-2" />
          <img src="/hyd/image (3).png" alt="" className="layered-img img-4" />
          <img src="/hyd/img.png" alt="" className="layered-img img-5" />
          <img src="/hyd/biryani.png" alt="" className="layered-img img-9" />
          <img src="/hyd/imgg.png" alt="" className="layered-img img-6" />
          <img src="/hyd/human.png" alt="" className="layered-img img-7" />
          <img src="/dancing.png" alt="" className="layered-img img-8" />
        </div>
        <div className="city-hero-fade" />
        <button className="city-back-btn" onClick={() => navigate('/login')}>←</button>
      </div>
      <div className="gallery-separator" />

      {/* ═══ PLACES ═══ */}
      {activeSection === 'places' && (
        <section className="realtime-section places-scrapbook-section">
          <div className="realtime-section-header places-scrapbook-header">
            <div className="section-badge places-scrapbook-badge">CITY RECS</div>
            <h2 className="realtime-title places-scrapbook-title">places in {displayName}</h2>
            <p className="realtime-subtitle places-scrapbook-subtitle">real Hyderabad landmarks, pinned like travel notes</p>
          </div>
          {loadingPlaces ? (
            <div className="realtime-loading"><div className="loading-spinner" /><p>Fetching real-time places…</p></div>
          ) : (
            <div className="places-grid places-scrapbook-grid">
              {places.map((place, i) => (
                <article
                  key={place.id}
                  className="place-card place-scrap"
                  style={{ animationDelay: `${i * 0.08}s`, '--tilt': `${[-4, 3, -2, 4, -3, 2, -1, 3][i % 8]}deg` }}
                >
                  <div className="place-card-img-wrap place-scrap-photo">
                    <span className="place-scrap-tape" />
                    <img
                      src={getPlaceImage(place, i)}
                      alt={place.name}
                      className="place-card-img"
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackApplied) return;
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = getPlaceFallbackImage(place, i);
                      }}
                    />
                  </div>
                  <div className="place-card-body place-scrap-body">
                    <div className="place-card-category place-scrap-category">
                      <span>{categoryEmojis[place.category] || categoryEmojis['default']}</span>
                      <span>{place.category}</span>
                    </div>
                    <h3 className="place-card-name">{place.name}</h3>
                    <p className="place-card-desc">{place.description}</p>
                    <div className="place-card-footer place-scrap-footer">
                      <span>{place.rating} rating</span>
                      <span>{place.timings}</span>
                      <span>{place.entry}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══ FOOD ═══ */}
      {activeSection === 'food' && (
        <section className="realtime-section">
          <div className="realtime-section-header">
            <div className="section-badge">🍽️ LIVE DATA</div>
            <h2 className="realtime-title">Restaurants & Food</h2>
            <p className="realtime-subtitle">Real restaurants in {displayName} — reviews, ratings & order online</p>
          </div>
          {loadingFoods ? (
            <div className="realtime-loading"><div className="loading-spinner" /><p>Fetching restaurants…</p></div>
          ) : (
            <div className="food-list">
              {foods.map((food, i) => (
                <div key={food.id} className="food-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="food-card-img-wrap">
                    <img src={food.image || getFoodFallbackImage(food.name)} alt={food.name} className="food-card-img" loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied === 'true') return;
                        img.dataset.fallbackApplied = 'true';
                        img.src = getFoodFallbackImage(food.name);
                      }} />
                    <span className="food-card-number">0{i + 1}</span>
                    <span className="food-card-type">{food.type}</span>
                  </div>
                  <div className="food-card-body">
                    <h3 className="food-card-name">{food.name}</h3>
                    <p className="food-card-desc">{food.description}</p>
                    <div className="food-card-meta">
                      <div className="food-meta-item">
                        <span className="food-meta-label">Must Try At</span>
                        <span className="food-meta-value">{food.must_try_at}</span>
                      </div>
                      <div className="food-meta-item">
                        <span className="food-meta-label">Price Range</span>
                        <span className="food-meta-value">{food.price_range}</span>
                      </div>
                      {food.avg_rating && (
                        <div className="food-meta-item">
                          <span className="food-meta-label">Avg Rating</span>
                          <span className="food-meta-value">{'★'.repeat(Math.round(parseFloat(food.avg_rating)))} {food.avg_rating}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Order links */}
                    {food.order_links && (
                      <div className="food-order-links">
                        <a href={food.order_links.zomato} target="_blank" rel="noopener noreferrer" className="order-btn order-zomato">
                          🔴 Order on Zomato
                        </a>
                        <a href={food.order_links.swiggy} target="_blank" rel="noopener noreferrer" className="order-btn order-swiggy">
                          🟠 Order on Swiggy
                        </a>
                      </div>
                    )}

                    {/* Customer reviews */}
                    {food.reviews && food.reviews.length > 0 && (
                      <div className="food-reviews">
                        <h4 className="food-reviews-title">💬 Customer Reviews ({food.reviews.length})</h4>
                        {food.reviews.map((review, rIdx) => (
                          <div key={rIdx} className="food-review-card">
                            <div className="food-review-header">
                              <div className="food-review-avatar">{review.user.charAt(0)}</div>
                              <span className="food-review-user">{review.user}</span>
                              <span className="food-review-stars">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span>
                            </div>
                            <p className="food-review-text">"{review.text}"</p>
                            {review.created_at && <span className="food-review-time">{timeAgo(review.created_at)}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write review button / form */}
                    {reviewOpenFor === food.id ? (
                      <div className="review-form">
                        <h4 className="review-form-title">Write a Review for {food.name}</h4>
                        <input className="review-input" placeholder="Your name" value={reviewForm.name}
                          onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} maxLength={100} />
                        <div className="review-stars-row">
                          <span className="review-label">Rating:</span>
                          <StarPicker value={reviewForm.stars} onChange={s => setReviewForm({ ...reviewForm, stars: s })} />
                        </div>
                        <textarea className="review-textarea" placeholder="Share your experience…"
                          value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                          maxLength={500} rows={3} />
                        <div className="review-form-actions">
                          <button className="review-cancel-btn" onClick={() => setReviewOpenFor(null)}>Cancel</button>
                          <button className="review-submit-btn" disabled={submittingReview}
                            onClick={() => handleReviewSubmit(food.name)}>
                            {submittingReview ? 'Submitting…' : 'Submit Review'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="write-review-btn" onClick={() => { setReviewOpenFor(food.id); setReviewForm({ ...reviewForm, restaurant: food.name }); }}>
                        ✍️ Write a Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══ EVENTS ═══ */}
      {activeSection === 'events' && (
        <>
          <section className="realtime-section">
            <div className="realtime-section-header">
              <div className="section-badge">🎭 LIVE DATA</div>
              <h2 className="realtime-title">Cultural Events</h2>
              <p className="realtime-subtitle">Real-time events in {displayName}</p>
            </div>
            {loadingEvents ? (
              <div className="realtime-loading"><div className="loading-spinner" /><p>Fetching events…</p></div>
            ) : events.length === 0 ? (
              <div className="realtime-empty"><p>No events found this month.</p></div>
            ) : (
              <div className="events-featured-row">
                {events.slice(0, 8).map((event, i) => (
                  <div key={event.id} className="event-featured-card" style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => setSelectedEvent(event)}>
                    <div className="event-featured-img-wrap">
                       <img src={getEventImage(event, i)}
                        alt={event.title} className="event-featured-img" loading="lazy"
                        onError={(e) => { e.target.src = EVENT_FALLBACK_POOL[i % EVENT_FALLBACK_POOL.length]; }} />
                      <div className="event-featured-overlay">
                        <span className="event-featured-date">{formatEventDate(event.date)}</span>
                        <h3 className="event-featured-title">{event.title}</h3>
                        <p className="event-featured-venue">📍 {event.venue}</p>
                        <button className="event-view-btn" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>View Event →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <div className="events-stamp-divider"><span>calendar view</span></div>
          <EventCalendar />
        </>
      )}

      {/* ═══ TRANSPORT ═══ */}
      {activeSection === 'transport' && (
        <section className="realtime-section">
          <div className="realtime-section-header">
            <div className="section-badge">🚇 LIVE DATA</div>
            <h2 className="realtime-title">Transportation</h2>
            <p className="realtime-subtitle">Routes, transit & ride-hailing for {displayName}</p>
          </div>
          {loadingTransport || !transport ? (
            <div className="realtime-loading"><div className="loading-spinner" /><p>Loading transport data…</p></div>
          ) : (
            <div className="transport-container">

              {/* ─── FARE ESTIMATOR ─── */}
              <div className="fare-estimator-card">
                <div className="fare-estimator-header">
                  <span className="fare-icon">💰</span>
                  <div>
                    <h3 className="fare-estimator-title">Fare Estimator</h3>
                    <p className="fare-estimator-sub">Select route to see max estimated fares</p>
                  </div>
                </div>
                <div className="fare-inputs-row">
                  <div className="fare-input-group">
                    <label className="fare-label">📍 Start Location</label>
                    <div className="fare-autocomplete">
                      <input className="fare-input" placeholder="Search location…" value={fareOriginSearch}
                        onChange={e => { setFareOriginSearch(e.target.value); setShowOriginDropdown(true); setFareOrigin(null); setFareResults(null); }}
                        onFocus={() => setShowOriginDropdown(true)} />
                      {showOriginDropdown && fareOriginSearch.length > 0 && (
                        <div className="fare-dropdown">
                          {filteredOriginLocs.length === 0 ? <div className="fare-dropdown-empty">No locations found</div> :
                            filteredOriginLocs.map((loc, i) => (
                              <div key={i} className="fare-dropdown-item" onClick={() => { setFareOrigin(loc); setFareOriginSearch(loc.name); setShowOriginDropdown(false); }}>
                                <span className="fare-dropdown-pin">📌</span>{loc.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="fare-arrow-divider">→</div>
                  <div className="fare-input-group">
                    <label className="fare-label">🏁 Destination</label>
                    <div className="fare-autocomplete">
                      <input className="fare-input" placeholder="Search location…" value={fareDestSearch}
                        onChange={e => { setFareDestSearch(e.target.value); setShowDestDropdown(true); setFareDest(null); setFareResults(null); }}
                        onFocus={() => setShowDestDropdown(true)} />
                      {showDestDropdown && fareDestSearch.length > 0 && (
                        <div className="fare-dropdown">
                          {filteredDestLocs.length === 0 ? <div className="fare-dropdown-empty">No locations found</div> :
                            filteredDestLocs.map((loc, i) => (
                              <div key={i} className="fare-dropdown-item" onClick={() => { setFareDest(loc); setFareDestSearch(loc.name); setShowDestDropdown(false); }}>
                                <span className="fare-dropdown-pin">📌</span>{loc.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="fare-estimate-btn" onClick={handleEstimateFare} disabled={!fareOrigin || !fareDest || fareLoading}>
                    {fareLoading ? 'Calculating…' : 'Estimate Fare →'}
                  </button>
                </div>

                {/* Fare Results */}
                {fareResults && (
                  <div className="fare-results">
                    <div className="fare-results-header">
                      <span className="fare-route-label">{fareResults.origin}</span>
                      <span className="fare-route-arrow">→</span>
                      <span className="fare-route-label">{fareResults.destination}</span>
                      <span className="fare-distance-badge">📏 {fareResults.distance} km</span>
                    </div>
                    <div className="fare-cards-grid">
                      {fareResults.estimates.map((est, i) => (
                        <div key={est.mode} className="fare-mode-card" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="fare-mode-icon">{est.icon}</div>
                          <div className="fare-mode-info">
                            <span className="fare-mode-label">{est.label}</span>
                            <span className="fare-mode-time">⏱️ {est.time}</span>
                          </div>
                          <div className="fare-mode-price">₹{est.fare}</div>
                          <span className="fare-mode-max-tag">max estimate</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* App links */}
              <div className="transport-apps">
                <a href={transport.appLinks.uber} target="_blank" rel="noopener noreferrer" className="transport-app-btn uber-btn">
                  <span className="app-icon">🚗</span>
                  <div><strong>Uber</strong><span>Book a ride</span></div>
                </a>
                <a href={transport.appLinks.rapido} target="_blank" rel="noopener noreferrer" className="transport-app-btn rapido-btn">
                  <span className="app-icon">🏍️</span>
                  <div><strong>Rapido</strong><span>Bike taxi</span></div>
                </a>
                <a href={transport.appLinks.google_maps} target="_blank" rel="noopener noreferrer" className="transport-app-btn gmaps-btn">
                  <span className="app-icon">🗺️</span>
                  <div><strong>Google Maps</strong><span>Transit routes</span></div>
                </a>
              </div>

              {/* Embedded map */}
              <div className="transport-map-section">
                <h3 className="transport-section-title">📍 City Map</h3>
                <div className="transport-map-wrap">
                  <iframe title={`${displayName} Map`} src={transport.mapUrl} className="transport-map-iframe" loading="lazy" />
                </div>
              </div>

              {/* Local route recommendations removed as per user request */}

              {/* Transit stops */}
              {transport.transitStops.length > 0 && (
                <div className="transport-stops-section">
                  <h3 className="transport-section-title">🚏 Nearby Transit Stops</h3>
                  <div className="transit-stops-grid">
                    {transport.transitStops.map((stop) => (
                      <div key={stop.id} className="transit-stop-card">
                        <span className="stop-type-badge">{stop.type === 'Metro/Rail' ? '🚇' : '🚌'} {stop.type}</span>
                        <span className="stop-name">{stop.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── CARPOOL BOARD ─── */}
              <div className="carpool-section">
                <h3 className="transport-section-title">🚗 Carpool Board</h3>
                <p className="carpool-subtitle">Share rides & save money with fellow travelers in {displayName}</p>

                <form className="carpool-composer" onSubmit={handleCarpoolPost}>
                  <div className="carpool-form-row">
                    <input className="carpool-input" placeholder="Your name" value={carpoolForm.name}
                      onChange={e => setCarpoolForm({ ...carpoolForm, name: e.target.value })} required maxLength={100} />
                  </div>
                  <div className="carpool-form-row carpool-route-row">
                    <div className="carpool-input-group">
                      <label className="carpool-label">From</label>
                      <input className="carpool-input" placeholder="Origin" value={carpoolForm.origin}
                        onChange={e => setCarpoolForm({ ...carpoolForm, origin: e.target.value })} required maxLength={200} />
                    </div>
                    <span className="carpool-arrow">→</span>
                    <div className="carpool-input-group">
                      <label className="carpool-label">To</label>
                      <input className="carpool-input" placeholder="Destination" value={carpoolForm.destination}
                        onChange={e => setCarpoolForm({ ...carpoolForm, destination: e.target.value })} required maxLength={200} />
                    </div>
                  </div>
                  <div className="carpool-form-row carpool-meta-row">
                    <div className="carpool-input-group">
                      <label className="carpool-label">Date</label>
                      <input className="carpool-input" type="date" value={carpoolForm.date}
                        onChange={e => setCarpoolForm({ ...carpoolForm, date: e.target.value })} required />
                    </div>
                    <div className="carpool-input-group">
                      <label className="carpool-label">Time</label>
                      <input className="carpool-input" type="time" value={carpoolForm.time}
                        onChange={e => setCarpoolForm({ ...carpoolForm, time: e.target.value })} required />
                    </div>
                    <div className="carpool-input-group carpool-seats-group">
                      <label className="carpool-label">Seats</label>
                      <input className="carpool-input" type="number" min="1" max="8" value={carpoolForm.seats}
                        onChange={e => setCarpoolForm({ ...carpoolForm, seats: e.target.value })} />
                    </div>
                  </div>
                  <textarea className="carpool-textarea" placeholder="Any notes? (e.g. preferred pickup point, luggage space...)"
                    value={carpoolForm.note} onChange={e => setCarpoolForm({ ...carpoolForm, note: e.target.value })} maxLength={300} rows={2} />
                  <div className="carpool-form-footer">
                    <button type="submit" className="carpool-submit-btn" disabled={carpoolPosting}>
                      {carpoolPosting ? 'Posting…' : '🚗 Post Ride Offer'}
                    </button>
                  </div>
                </form>

                <div className="carpool-feed">
                  {carpoolPosts.length === 0 ? (
                    <div className="carpool-empty">
                      <span className="carpool-empty-icon">🚗</span>
                      <p>No carpool offers yet. Be the first to share a ride!</p>
                    </div>
                  ) : carpoolPosts.map(cp => (
                    <div key={cp.id} className="carpool-card">
                      <div className="carpool-card-header">
                        <div className="carpool-avatar">{cp.author_name.charAt(0).toUpperCase()}</div>
                        <div className="carpool-author-info">
                          <span className="carpool-author">{cp.author_name}</span>
                          <span className="carpool-time">{timeAgo(cp.created_at)}</span>
                        </div>
                        <div className="carpool-seats-badge">🪑 {cp.seats} seat{cp.seats > 1 ? 's' : ''}</div>
                      </div>
                      <div className="carpool-card-route">
                        <span className="carpool-origin">📍 {cp.origin}</span>
                        <span className="carpool-card-arrow">→</span>
                        <span className="carpool-destination">🏁 {cp.destination}</span>
                      </div>
                      <div className="carpool-card-meta">
                        <span>📅 {cp.travel_date}</span>
                        <span>🕐 {cp.travel_time}</span>
                      </div>
                      {cp.note && <p className="carpool-card-note">💬 {cp.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </section>
      )}

      {/* ═══ ACCOMMODATIONS ═══ */}
      {activeSection === 'accommodations' && (
        <section className="realtime-section">
          <div className="realtime-section-header">
            <div className="section-badge">🏠 LIVING</div>
            <h2 className="realtime-title">Accommodations</h2>
            <p className="realtime-subtitle">Find your new home in {displayName}</p>
          </div>
          <div className="acc-filters-container">
            <div className="acc-filter-group">
              <span className="acc-filter-label">Type:</span>
              <div className="acc-filters">
                {['All', 'PG', 'Flat', 'Rental'].map(f => (
                  <button key={f} className={`acc-filter-btn ${accFilterType === f ? 'active' : ''}`} onClick={() => setAccFilterType(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="acc-filter-group">
              <span className="acc-filter-label">Price:</span>
              <div className="acc-filters">
                {['All', '< 10k', '10k - 20k', '> 20k'].map(f => (
                  <button key={f} className={`acc-filter-btn ${accFilterPrice === f ? 'active' : ''}`} onClick={() => setAccFilterPrice(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="acc-filter-group">
              <span className="acc-filter-label">Furnishing:</span>
              <div className="acc-filters">
                {['All', 'Fully-Furnished', 'Semi-Furnished', 'Unfurnished'].map(f => (
                  <button key={f} className={`acc-filter-btn ${accFilterFurnishing === f ? 'active' : ''}`} onClick={() => setAccFilterFurnishing(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          {loadingAccommodations ? (
            <div className="realtime-loading"><div className="loading-spinner" /><p>Finding homes…</p></div>
          ) : (
            <div className="acc-grid">
              {accommodations.filter(a => {
                const typeMatch = accFilterType === 'All' || a.type.toLowerCase() === accFilterType.toLowerCase();
                const furnishMatch = accFilterFurnishing === 'All' || a.furnishing === accFilterFurnishing;
                let priceMatch = true;
                if (accFilterPrice === '< 10k') priceMatch = a.price < 10000;
                else if (accFilterPrice === '10k - 20k') priceMatch = a.price >= 10000 && a.price <= 20000;
                else if (accFilterPrice === '> 20k') priceMatch = a.price > 20000;
                return typeMatch && furnishMatch && priceMatch;
              }).map(acc => (
                <div key={acc.id} className="acc-card">
                  <img src={acc.image} alt={acc.name} className="acc-img" />
                  <div className="acc-content">
                    <div className="acc-card-header">
                      <div className="acc-badges">
                        <span className="acc-type-badge">{acc.type}</span>
                        {acc.furnishing && <span className="acc-furnish-badge">{acc.furnishing}</span>}
                      </div>
                      {acc.source && <span className="acc-source-badge">Via {acc.source}</span>}
                    </div>
                    <h3 className="acc-name">{acc.name}</h3>
                    <p className="acc-address">📍 {acc.address}</p>
                    <div className="acc-price">
                      <span className="acc-rent">₹{acc.price}/mo</span>
                      <span className="acc-deposit">Dep: ₹{acc.deposit}</span>
                    </div>
                    <div className="acc-amenities">
                      {acc.amenities.map(am => <span key={am} className="acc-amenity">{am}</span>)}
                    </div>
                    <div className="acc-reviews-section">
                      <h4 className="acc-reviews-title">Mover Reviews ({acc.rating} ★)</h4>
                      {acc.reviews.map((r, i) => (
                        <div key={i} className="acc-review">
                          <span className="acc-rev-user">{r.user}:</span>
                          <span className="acc-rev-text">"{r.text}"</span>
                        </div>
                      ))}
                    </div>
                    <a href={acc.source === 'NoBroker' ? `https://www.nobroker.in/` : `https://housing.com/in/rent/searches?qs=${encodeURIComponent(acc.address + ' ' + displayName)}`} target="_blank" rel="noopener noreferrer" className="acc-live-btn">
                      Check on {acc.source || 'Aggregator'} ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={e => e.stopPropagation()}>
            <button className="event-modal-close" onClick={() => setSelectedEvent(null)}>×</button>
            <div className="event-modal-body">
              <span className="event-modal-date-pill">{formatEventDate(selectedEvent.date)}</span>
              <h2 className="event-modal-title">{selectedEvent.title}</h2>
              <div className="event-modal-details">
                <div className="event-modal-detail"><span>📍</span><span>{selectedEvent.venue || displayName}</span></div>
                <div className="event-modal-detail"><span>📅</span><span>{selectedEvent.date}</span></div>
                <div className="event-modal-detail"><span>🏷️</span><span>{selectedEvent.type}</span></div>
              </div>
              <p className="event-modal-desc">Join this exciting event in {displayName}! Experience the vibrant culture of the city.</p>
              {selectedEvent.bookingLink && (
                <a href={selectedEvent.bookingLink} target="_blank" rel="noopener noreferrer" className="event-modal-book-link">
                  🎟️ Book Tickets Now →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ COMMUNITY ═══ */}
      {activeSection === 'community' && (
        <section className="city-section">
          <div className="section-header">
            <h2 className="section-title">Community Wall</h2>
            <p className="section-subtitle">Connect with fellow nomads in {displayName}</p>
          </div>
          <form className="community-composer" onSubmit={handlePost}>
            <div className="composer-top">
              <div className="composer-avatar">✈️</div>
              <input className="composer-name" placeholder="Your name..." value={authorName}
                onChange={e => setAuthorName(e.target.value)} required maxLength={50} />
            </div>
            <textarea className="composer-textarea" placeholder={`Share something about ${displayName}…`}
              value={postContent} onChange={e => setPostContent(e.target.value)} required maxLength={500} rows={3} />
            <div className="composer-footer">
              <span className="composer-count">{postContent.length}/500</span>
              <button type="submit" className="composer-btn" disabled={posting}>{posting ? 'Posting...' : 'Post →'}</button>
            </div>
          </form>
          <div className="posts-feed">
            {posts.length === 0 ? (
              <div className="posts-empty"><p>No posts yet. Be the first!</p></div>
            ) : posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">{post.author_name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="post-author">{post.author_name}</p>
                    <p className="post-time">{timeAgo(post.created_at)}</p>
                  </div>
                </div>
                <p className="post-content">{post.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="city-footer">
        <p>NOMAD / {displayName.toUpperCase()} — discover your next home</p>
      </footer>
    </div>
  );
};

export default HyderabadPage;
