const fs = require('fs');

const url     = process.env.SUPABASE_URL     || '';
const anonKey = process.env.SUPABASE_ANON_KEY || '';

if (!url || !anonKey) {
  console.warn('[build-config] Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set — config.js will have empty values.');
}

const content = `var SUPABASE_CONFIG = {
  url:     '${url}',
  anonKey: '${anonKey}',
};
`;

fs.writeFileSync('config.js', content, 'utf8');
console.log('config.js generated successfully');
