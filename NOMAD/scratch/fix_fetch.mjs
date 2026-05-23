import fs from 'fs';

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add API_BASE import if not present
  if (!content.includes("import API_BASE from '../utils/api';")) {
    if (file.includes('LoginPage.jsx')) {
      content = content.replace("import './LoginPage.css';", "import API_BASE from '../utils/api';\nimport './LoginPage.css';");
    } else if (file.includes('EventCalendar.jsx')) {
      content = content.replace("import './EventCalendar.css';", "import API_BASE from '../utils/api';\nimport './EventCalendar.css';");
    } else if (file.includes('HyderabadPage.jsx')) {
      content = content.replace("import './HyderabadPage.css';", "import API_BASE from '../utils/api';\nimport './HyderabadPage.css';");
    }
  }

  // Replace 'http://localhost:3001/api/...' with `${API_BASE}/api/...`
  // And `http://localhost:3001/api/...` with `${API_BASE}/api/...`
  content = content.replace(/'http:\/\/localhost:3001\/api\/([^']+)'/g, '`${API_BASE}/api/$1`');
  content = content.replace(/http:\/\/localhost:3001/g, '${API_BASE}');

  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}

updateFile('src/pages/HyderabadPage.jsx');
updateFile('src/pages/LoginPage.jsx');
updateFile('src/components/EventCalendar.jsx');
