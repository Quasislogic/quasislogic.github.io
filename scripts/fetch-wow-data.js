const fs = require('fs');
const axios = require('axios');

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
  const response = await axios.get(`https://us.api.blizzard.com/data/wow/item/${itemId}`, {
    params: {
      namespace: 'static-us',
      locale: 'en_US',
      access_token: token,
    },
  });
  return response.data;
}

(async () => {
  try {
    const token = await getToken();
    const items = [190320, 190321, 198330]; // add more item IDs here

    const results = {};
    for (const id of items) {
      console.log(`Fetching item ${id}...`);
      const data = await fetchItemData(id, token);
      results[id] = data;
    }

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/items.json', JSON.stringify(results, null, 2));
    console.log('✅ WoW data saved to data/items.json');
  } catch (err) {
    console.error('❌ Failed to fetch data:', err);
    process.exit(1);
  }
})();
