const fs = require('fs');
const axios = require('axios');

const BASE_URL = 'https://us.api.blizzard.com/data/wow/mop-classic/item';
const NAMESPACE = 'static-classic1x-us';
const LOCALE = 'en_US';
const OUTPUT_FILE = 'data/items.json';

// ✅ Replace with real item IDs you want to test
const items = [
  98893, // Crafted Malevolent Gladiator’s Leather Helm (MoP Remix)
  98928, // Crafted Malevolent Gladiator’s Plate Helm
  98600  // Singing Crystal Helm
];

async function getToken() {
  const response = await axios.post('https://oauth.battle.net/token', null, {
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
    params: {
      grant_type: 'client_credentials',
    },
  });
  return response.data.access_token;
}

async function fetchItemData(itemId, token) {
  const url = `${BASE_URL}/${itemId}`;
  const response = await axios.get(url, {
    params: {
      namespace: NAMESPACE,
      locale: LOCALE,
      access_token: token,
    },
  });
  return response.data;
}

(async () => {
  try {
    const token = await getToken();
    const results = {};

    for (const id of items) {
      try {
        console.log(`🔍 Fetching item ${id}...`);
        const data = await fetchItemData(id, token);
        results[id] = data;
        console.log(`✅ Item ${id} fetched`);
      } catch (err) {
        const status = err.response?.status || 'UNKNOWN';
        console.warn(`⚠️  Item ${id} failed with status ${status}`);
      }
    }

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`📦 Saved ${Object.keys(results).length} items to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('❌ Top-level failure:', err.message || err);
    process.exit(1);
  }
})();
