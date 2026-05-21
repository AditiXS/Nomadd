/** Per-city content for the shared city page (Hyderabad, Delhi, …) */

const WIKI = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

export const cityConfigs = {
  hyderabad: {
    displayName: 'Hyderabad',
    mapCityName: 'Hyderabad',
    mapAriaLabel: 'Clickable illustrated map of Hyderabad landmarks',
    introPath: '/intro/hyderabad',
    heroImages: [
      '/hyd/Untitled (1).png',
      '/hyd/Untitled.png',
      '/hyd/image (3).png',
      '/hyd/img.png',
      '/hyd/biryani.png',
      '/hyd/imgg.png',
      '/hyd/human.png',
      '/dancing.png',
    ],
    placeImageFallbacks: {
      charminar: `${WIKI}/7/71/Charminar_Hyderabad_1.jpg/330px-Charminar_Hyderabad_1.jpg`,
      'golconda fort': `${WIKI}/5/56/Golconda_Fort_005.jpg/330px-Golconda_Fort_005.jpg`,
      'hussain sagar lake': `${WIKI}/d/de/HussainSagar_Moon_Rise.jpg/330px-HussainSagar_Moon_Rise.jpg`,
      'ramoji film city': `${WIKI}/d/d1/Ramoji_Film_City.jpg/330px-Ramoji_Film_City.jpg`,
      'salar jung museum': `${WIKI}/a/ac/Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg/330px-Salar_Jung_Museum%2C_Hyderabad%2C_India.jpg`,
      'birla mandir': `${WIKI}/3/3c/Birla_Mandir%2C_Hyderabad.png/330px-Birla_Mandir%2C_Hyderabad.png`,
      'chowmahalla palace': `${WIKI}/c/ce/Chowmahalla_Palace_01.jpg/330px-Chowmahalla_Palace_01.jpg`,
      'nehru zoological park': `${WIKI}/b/ba/Hyderabad_zoo.jpg/330px-Hyderabad_zoo.jpg`,
    },
    mapPlaces: [
      { name: 'Golconda Fort', type: 'Fort', asset: '/hyd/icon_golconda.png', wiki: 'https://en.wikipedia.org/wiki/Golconda', x: 22, y: 29, size: 'large' },
      { name: 'Hussain Sagar', type: 'Lake', asset: '/hyd/icon_buddha.png', wiki: 'https://en.wikipedia.org/wiki/Hussain_Sagar', x: 54, y: 24, size: 'medium' },
      { name: 'Birla Mandir', type: 'Temple', asset: '/hyd/icon_charminar.png', wiki: 'https://en.wikipedia.org/wiki/Birla_Mandir,_Hyderabad', x: 70, y: 35, size: 'small' },
      { name: 'Salar Jung Museum', type: 'Museum', asset: '/hyd/icon_ramoji.png', wiki: 'https://en.wikipedia.org/wiki/Salar_Jung_Museum', x: 39, y: 52, size: 'small' },
      { name: 'Charminar', type: 'Monument', asset: '/hyd/icon_charminar.png', wiki: 'https://en.wikipedia.org/wiki/Charminar', x: 58, y: 57, size: 'hero' },
      { name: 'Chowmahalla Palace', type: 'Palace', asset: '/hyd/icon_golconda.png', wiki: 'https://en.wikipedia.org/wiki/Chowmahalla_Palace', x: 75, y: 62, size: 'medium' },
      { name: 'Ramoji Film City', type: 'Studio', asset: '/hyd/icon_ramoji.png', wiki: 'https://en.wikipedia.org/wiki/Ramoji_Film_City', x: 42, y: 82, size: 'large' },
    ],
    mapOutlinePaths: [
      'M302 26c54 42 32 93 84 137 37 31 98 17 132 57 31 37 6 89 47 127 37 35 93 20 118 65 28 51-34 91-30 148 4 61 81 86 58 139-19 45-80 32-124 73-46 43-41 114-97 135-51 19-90-37-148-28-62 10-90 83-150 70-58-13-55-91-107-128-45-32-113-10-143-56-34-51 28-99 14-160-12-54-76-78-64-131 13-57 89-56 118-107 30-53-11-116 29-159 39-43 103-5 151-42 52-40 49-112 112-140Z',
      'M150 322c72 35 159 39 238 22 71-15 126-49 197-45',
      'M136 572c72-36 149-44 225-22 83 25 148 12 215-34',
      'M214 720c82 18 157 9 228-28',
    ],
    foodImageMap: {
      'hyderabadi biryani': `${WIKI}/7/7c/Biryani.jpg/640px-Biryani.jpg`,
      haleem: `${WIKI}/c/c8/Ramzan_food_%2843%29.jpg/640px-Ramzan_food_%2843%29.jpg`,
      'double ka meetha': `${WIKI}/9/9a/Bread_pudding_-_Aubry%27s_Orleans.jpg/640px-Bread_pudding_-_Aubry%27s_Orleans.jpg`,
      'irani chai': `${WIKI}/e/e8/Cup-of-tea.jpg/640px-Cup-of-tea.jpg`,
      'qubani ka meetha': `${WIKI}/4/43/Peaches_and_plums.jpg/640px-Peaches_and_plums.jpg`,
      lukhmi: `${WIKI}/5/5c/Samosa_%28238609264%29.jpg/640px-Samosa_%28238609264%29.jpg`,
    },
    foodFallbacks: [
      { id: 'f1', name: 'Hyderabadi Biryani', type: 'Local Famous', description: 'World-famous slow-cooked basmati rice with marinated meat, spices, and saffron.', must_try_at: 'Paradise, Pista House, Shah Ghouse', price_range: 'Moderate', avg_rating: 4.8 },
      { id: 'f2', name: 'Haleem', type: 'Specialty', description: 'A rich, savory stew of pounded meat, lentils, and wheat, slow-cooked for hours.', must_try_at: 'Pista House, Cafe 555', price_range: 'Moderate', avg_rating: 4.9 },
      { id: 'f3', name: 'Double Ka Meetha', type: 'Dessert', description: 'Traditional bread pudding dessert made with fried bread slices soaked in hot milk with saffron.', must_try_at: 'Karachi Bakery, Nimrah Cafe', price_range: 'Low', avg_rating: 4.6 },
      { id: 'f4', name: 'Irani Chai', type: 'Street Food', description: 'Iconic thick milky tea served alongside buttery Osmania biscuits.', must_try_at: 'Nimrah Cafe, Niloufer Cafe', price_range: 'Low', avg_rating: 4.7 },
      { id: 'f5', name: 'Qubani Ka Meetha', type: 'Dessert', description: 'Traditional Hyderabadi dessert of stewed apricots topped with fresh cream.', must_try_at: 'Hotel Shadab, Paradise', price_range: 'Low', avg_rating: 4.5 },
      { id: 'f6', name: 'Lukhmi', type: 'Street Food', description: 'Flaky pastry pockets stuffed with spiced minced meat — the Hyderabadi samosa.', must_try_at: 'Old City, Charminar area', price_range: 'Low', avg_rating: 4.6 },
    ],
  },

  delhi: {
    displayName: 'Delhi',
    mapCityName: 'Delhi',
    mapAriaLabel: 'Clickable illustrated map of Delhi landmarks',
    introPath: '/intro/delhi',
    heroImages: [
      `${WIKI}/f/fd/India_Gate_in_New_Delhi_03-2016_img3.jpg/640px-India_Gate_in_New_Delhi_03-2016_img3.jpg`,
      `${WIKI}/2/2f/Red_Fort_in_Delhi_03-2016.jpg/640px-Red_Fort_in_Delhi_03-2016.jpg`,
      `${WIKI}/3/3c/Qutub_Minar_in_the_monsoons.jpg/640px-Qutub_Minar_in_the_monsoons.jpg`,
      `${WIKI}/4/4b/Lotus_temple_in_India.jpg/640px-Lotus_temple_in_India.jpg`,
      `${WIKI}/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg`,
      `${WIKI}/0/0c/Humayun%27s_Tomb%2C_Delhi.jpg/640px-Humayun%27s_Tomb%2C_Delhi.jpg`,
      `${WIKI}/8/8e/Akshardham_Temple_-_Delhi.jpg/640px-Akshardham_Temple_-_Delhi.jpg`,
      '/dancing.png',
    ],
    placeImageFallbacks: {
      'india gate': `${WIKI}/f/fd/India_Gate_in_New_Delhi_03-2016_img3.jpg/330px-India_Gate_in_New_Delhi_03-2016_img3.jpg`,
      'red fort': `${WIKI}/2/2f/Red_Fort_in_Delhi_03-2016.jpg/330px-Red_Fort_in_Delhi_03-2016.jpg`,
      'qutub minar': `${WIKI}/3/3c/Qutub_Minar_in_the_monsoons.jpg/330px-Qutub_Minar_in_the_monsoons.jpg`,
      'lotus temple': `${WIKI}/4/4b/Lotus_temple_in_India.jpg/330px-Lotus_temple_in_India.jpg`,
      'humayun\'s tomb': `${WIKI}/0/0c/Humayun%27s_Tomb%2C_Delhi.jpg/330px-Humayun%27s_Tomb%2C_Delhi.jpg`,
      'akshardham': `${WIKI}/8/8e/Akshardham_Temple_-_Delhi.jpg/330px-Akshardham_Temple_-_Delhi.jpg`,
      'chandni chowk': `${WIKI}/5/5c/Crowded_street_-_geograph.org.uk_-_1002342.jpg/330px-Crowded_street_-_geograph.org.uk_-_1002342.jpg`,
      'connaught place': `${WIKI}/5/5c/Crowded_street_-_geograph.org.uk_-_1002342.jpg/330px-Crowded_street_-_geograph.org.uk_-_1002342.jpg`,
    },
    mapPlaces: [
      { name: 'India Gate', type: 'Monument', asset: `${WIKI}/f/fd/India_Gate_in_New_Delhi_03-2016_img3.jpg/120px-India_Gate_in_New_Delhi_03-2016_img3.jpg`, wiki: 'https://en.wikipedia.org/wiki/India_Gate', x: 52, y: 58, size: 'hero' },
      { name: 'Red Fort', type: 'Fort', asset: `${WIKI}/2/2f/Red_Fort_in_Delhi_03-2016.jpg/120px-Red_Fort_in_Delhi_03-2016.jpg`, wiki: 'https://en.wikipedia.org/wiki/Red_Fort', x: 62, y: 38, size: 'large' },
      { name: 'Qutub Minar', type: 'Heritage', asset: `${WIKI}/3/3c/Qutub_Minar_in_the_monsoons.jpg/120px-Qutub_Minar_in_the_monsoons.jpg`, wiki: 'https://en.wikipedia.org/wiki/Qutb_Minar', x: 28, y: 72, size: 'large' },
      { name: 'Lotus Temple', type: 'Temple', asset: `${WIKI}/4/4b/Lotus_temple_in_India.jpg/120px-Lotus_temple_in_India.jpg`, wiki: 'https://en.wikipedia.org/wiki/Lotus_Temple', x: 48, y: 78, size: 'medium' },
      { name: 'Humayun\'s Tomb', type: 'Mausoleum', asset: `${WIKI}/0/0c/Humayun%27s_Tomb%2C_Delhi.jpg/120px-Humayun%27s_Tomb%2C_Delhi.jpg`, wiki: 'https://en.wikipedia.org/wiki/Humayun%27s_Tomb', x: 72, y: 48, size: 'medium' },
      { name: 'Akshardham', type: 'Temple', asset: `${WIKI}/8/8e/Akshardham_Temple_-_Delhi.jpg/120px-Akshardham_Temple_-_Delhi.jpg`, wiki: 'https://en.wikipedia.org/wiki/Swaminarayan_Akshardham_(Delhi)', x: 78, y: 68, size: 'small' },
      { name: 'Chandni Chowk', type: 'Bazaar', asset: `${WIKI}/5/5c/Crowded_street_-_geograph.org.uk_-_1002342.jpg/120px-Crowded_street_-_geograph.org.uk_-_1002342.jpg`, wiki: 'https://en.wikipedia.org/wiki/Chandni_Chowk', x: 58, y: 28, size: 'medium' },
    ],
    mapOutlinePaths: [
      'M180 120h320c28 0 52 24 52 52v476c0 28-24 52-52 52H180c-28 0-52-24-52-52V172c0-28 24-52 52-52Z',
      'M200 280h280',
      'M200 420h240',
      'M220 560h200',
    ],
    foodImageMap: {
      'butter chicken': `${WIKI}/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg`,
      'chole bhature': `${WIKI}/1/1a/Pav_bhaji.jpg/640px-Pav_bhaji.jpg`,
      'paranthe wali gali': `${WIKI}/3/33/Masala_Dosa_-_Udupi_Hotel.jpg/640px-Masala_Dosa_-_Udupi_Hotel.jpg`,
      'kebabs': `${WIKI}/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg`,
      'chole kulche': `${WIKI}/1/1a/Pav_bhaji.jpg/640px-Pav_bhaji.jpg`,
      'dahi bhalla': `${WIKI}/1/10/Panipuri.jpg/640px-Panipuri.jpg`,
      'nalli nihari': `${WIKI}/7/7c/Biryani.jpg/640px-Biryani.jpg`,
    },
    foodFallbacks: [
      { id: 'f1', name: 'Butter Chicken', type: 'Local Famous', description: 'Iconic creamy tomato-based chicken curry born in Delhi\'s kitchens.', must_try_at: 'Moti Mahal, Kake Da Hotel', price_range: 'Moderate', avg_rating: 4.9 },
      { id: 'f2', name: 'Chole Bhature', type: 'Street Food', description: 'Fluffy fried bread with spicy chickpea curry — the ultimate Delhi breakfast.', must_try_at: 'Sitaram Diwan Chand, Kwality', price_range: 'Low', avg_rating: 4.8 },
      { id: 'f3', name: 'Paranthe Wali Gali', type: 'Street Food', description: 'Famous Chandni Chowk stuffed parathas with fillings like rabri and dry fruits.', must_try_at: 'Paranthe Wali Gali, Chandni Chowk', price_range: 'Low', avg_rating: 4.7 },
      { id: 'f4', name: 'Kebabs', type: 'Local Famous', description: 'Smoky seekh and galouti kebabs from Old Delhi\'s legendary grill houses.', must_try_at: 'Karim\'s, Al Jawahar, Qureshi Kabab', price_range: 'Moderate', avg_rating: 4.8 },
      { id: 'f5', name: 'Chole Kulche', type: 'Street Food', description: 'Soft kulcha bread with tangy chole — a Delhi street-food classic.', must_try_at: 'Chache Di Hatti, Nagpal Chole Bhature', price_range: 'Low', avg_rating: 4.6 },
      { id: 'f6', name: 'Dahi Bhalla', type: 'Street Food', description: 'Lentil dumplings in creamy yogurt with chutneys and chaat masala.', must_try_at: 'Natraj Dahi Bhalle Wala, Bikanervala', price_range: 'Low', avg_rating: 4.5 },
    ],
  },
};

export function getCityConfig(citySlug) {
  const key = (citySlug || 'hyderabad').toLowerCase();
  return cityConfigs[key] || cityConfigs.hyderabad;
}

export const CITIES_WITH_INTRO = ['hyderabad', 'delhi'];
