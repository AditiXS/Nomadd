const fs = require('fs');
const indiaMap = require('@svg-maps/india').default;

const lines = ['export const indiaData = ['];

indiaMap.locations.forEach((loc, i, arr) => {
  lines.push(`  { id: "${loc.id}", label: "${loc.name}", d: "${loc.path}" }${i === arr.length - 1 ? '' : ','}`);
});

lines.push('];');

fs.writeFileSync('src/components/IndiaPaths.js', lines.join('\n'));
console.log('Fixed IndiaPaths.js successfully!');
