const fs = require('fs');

async function getWikiImage(title) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=640`);
    const d = await res.json();
    const pages = d.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null;
    return pages[pageId].thumbnail?.source || null;
  } catch (e) {
    return null;
  }
}

async function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('https://loremflickr.com')) {
      let name = '';
      let m = line.match(/name:\s*'([^']+)'/);
      if (m) name = m[1];
      else {
        m = line.match(/'([^']+)':\s*'https:\/\/loremflickr/);
        if (m) name = m[1];
        else {
          m = line.match(/title:\s*'([^']+)'/);
          if (m) name = m[1];
        }
      }
      
      if (name) {
        console.log('Fetching for:', name);
        let url = await getWikiImage(name);
        
        // Advanced fallback queries for better matches
        if (!url) {
          if (name.toLowerCase() === 'irani chai') url = await getWikiImage('Irani café');
          else if (name.toLowerCase() === 'double ka meetha') url = await getWikiImage('Double ka meetha');
          else if (name.toLowerCase() === 'khubani ka meetha') url = await getWikiImage('Qubani ka meetha');
          else if (name.toLowerCase() === 'vada pav') url = await getWikiImage('Vada pav');
          else if (name.toLowerCase() === 'chole bhature') url = await getWikiImage('Chole bhature');
          else if (name.toLowerCase() === 'idli sambhar') url = await getWikiImage('Idli');
          else if (name.toLowerCase() === 'kathi rolls') url = await getWikiImage('Kati roll');
          else if (name.toLowerCase() === 'mishti doi') url = await getWikiImage('Mishti doi');
          else if (name.toLowerCase() === 'victoria memorial') url = await getWikiImage('Victoria Memorial (India)');
          else if (name.toLowerCase() === 'india gate') url = await getWikiImage('India Gate');
          else {
            let parts = name.split(' ');
            url = await getWikiImage(parts[parts.length - 1]); 
          }
        }
        
        if (url) {
          lines[i] = line.replace(/'https:\/\/loremflickr\.com[^']+'/, `'${url}'`);
          console.log(' ->', url);
        } else {
          console.log(' -> NOT FOUND, keeping loremflickr for now');
        }
      }
    }
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

(async () => {
  await fixFile('server.js');
  await fixFile('src/pages/HyderabadPage.jsx');
  console.log('Done!');
})();
