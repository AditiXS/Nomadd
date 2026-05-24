const fs = require('fs');

const headers = { 'User-Agent': 'NomadApp/1.0 (contact@example.com)' };

async function getWikipediaImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=640`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch (error) {
    console.error('Error fetching image for', title, error.message);
  }
  return null;
}

const foodQueries = {
  'hyderabadi biryani': 'Hyderabadi_biryani',
  'haleem': 'Haleem',
  'double ka meetha': 'Double_ka_meetha',
  'irani chai': 'Irani_café',
  'qubani ka meetha': 'Qubani_ka_meetha',
  'lukhmi': 'Lukhmi',
  'vada pav': 'Vada_pav',
  'pav bhaji': 'Pav_bhaji',
  'pani puri': 'Panipuri',
  'bombay sandwich': 'Sandwich',
  'butter chicken': 'Butter_chicken',
  'chole bhature': 'Chole_bhature',
  'paranthe wali gali': 'Paranthe_Wali_Gali',
  'kebabs': 'Kebab',
  'chole kulche': 'Kulcha',
  'dahi bhalla': 'Dahi_vada',
  'masala dosa': 'Dosa',
  'filter coffee': 'Indian_filter_coffee',
  'akki roti': 'Akki_rotti',
  'bisi bele bath': 'Bisi_bele_bath',
  'idli sambhar': 'Idli',
  'chettinad chicken curry': 'Chettinad_cuisine',
  'kothu parotta': 'Kothu_parotta',
  'kathi roll': 'Kati_roll',
  'rosogolla': 'Rasgulla',
  'hilsa fish curry': 'Ilish'
};

const placeQueries = {
  'charminar': 'Charminar',
  'golconda fort': 'Golconda_Fort',
  'hussain sagar lake': 'Hussain_Sagar',
  'ramoji film city': 'Ramoji_Film_City',
  'salar jung museum': 'Salar_Jung_Museum',
  'birla mandir': 'Birla_Mandir,_Hyderabad',
  'chowmahalla palace': 'Chowmahalla_Palace',
  'nehru zoological park': 'Nehru_Zoological_Park',
  'india gate': 'India_Gate',
  'red fort': 'Red_Fort',
  'qutub minar': 'Qutb_Minar',
  'lotus temple': 'Lotus_Temple',
  "humayun's tomb": 'Humayun%27s_Tomb',
  'akshardham': 'Swaminarayan_Akshardham_(New_Delhi)',
  'chandni chowk': 'Chandni_Chowk',
  'connaught place': 'Connaught_Place,_New_Delhi'
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const foodMap = {};
  for (const [key, title] of Object.entries(foodQueries)) {
    const url = await getWikipediaImage(title);
    if (url) foodMap[key] = url;
    await delay(300);
  }

  const placeMap = {};
  for (const [key, title] of Object.entries(placeQueries)) {
    const url = await getWikipediaImage(title);
    if (url) placeMap[key] = url;
    await delay(300);
  }

  console.log('--- JSON_START ---');
  console.log(JSON.stringify({ foodImageMap: foodMap, placeImageFallbacks: placeMap }, null, 2));
  console.log('--- JSON_END ---');
}

run();
