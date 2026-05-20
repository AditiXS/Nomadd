import { createRequire } from 'module';
import { writeFileSync } from 'fs';

const require = createRequire(import.meta.url);
const india = require('@svg-maps/india').default;

const lines = india.locations.map(loc => {
  return `\t{ id: "${loc.id}", label: "${loc.name}", d: "${loc.path}" }`;
});

const output = `export const indiaData = [\n${lines.join(',\n')}\n];\n`;

writeFileSync('src/components/IndiaPaths.js', output, 'utf-8');
console.log(`Written ${india.locations.length} states to IndiaPaths.js`);
