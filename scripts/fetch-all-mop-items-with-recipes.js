const fs = require('fs');
const axios = require('axios');

const ITEM_INDEX_URL = 'https://us.api.blizzard.com/data/wow/mop-classic/item/index';
const RECIPE_INDEX_URL = 'https://us.api.blizzard.com/data/wow/mop-classic/recipe/index';
const ITEM_URL = 'https://us.api.blizzard.com/data/wow/mop-classic/item';
const MEDIA_URL = 'https://us.api.blizzard.com/data/wow/media/item';
const RECIPE_URL = 'https://us.api.blizzard.com/data/wow/mop-classic/recipe';
const NAMESPACE = 'static-classic1x-us';
const LOCALE = 'en_US';
const OUTPUT_FILE = 'data/all-items-with-recipes.json';

async function getToken() {
  const response = await axios.post('https://oauth.battle.net/token', null, {
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
    params: { grant_type: 'client_credentials' },
  });
  return response.data.access_token;
}

async function fetchItemIds(token) {
  const res = await axios.get(ITEM_INDEX_URL, {
    params: { namespace: NAMESPACE, access_token: token }
  });
  return res.data.items.map(item => item.id);
}

async function fetchRecipeIndex(token) {
  const res = await axios.get(RECIPE_INDEX_URL, {
    params: { namespace: NAMESPACE, access_token: token }
  });
  return res.data.recipes.map(r => r.id);
}

async function fetchItemData(itemId, token) {
  try {
    const [itemRes, mediaRes] = await Promise.all([
      axios.get(`${ITEM_URL}/${itemId}`, {
        params: {
          namespace: NAMESPACE,
          locale: LOCALE,
          access_token: token
        }
      }),
      axios.get(`${MEDIA_URL}/${itemId}`, {
        params: {
          namespace: NAMESPACE,
          access_token: token
        }
      })
    ]);

    const item = itemRes.data;
    const icon = mediaRes.data.assets?.find(a => a.key === 'icon')?.value || null;

    return {
      id: item.id,
      name: item.name,
      quality: item.quality?.name || '',
      class: item.item_class?.name || '',
      subclass: item.item_subclass?.name || '',
      slot: item.inventory_type?.name || '',
      itemLevel: item.level,
      requiredLevel: item.required_level,
      icon
    };
  } catch {
    return null;
  }
}

async function fetchRecipeData(recipeId, token) {
  try {
    const res = await axios.get(`${RECIPE_URL}/${recipeId}`, {
      params: {
        namespace: NAMESPACE,
        locale: LOCALE,
        access_token: token
      }
    });

    const r = res.data;
    if (!r.crafted_item?.id) return null;

    return {
      craftedItemId: r.crafted_item.id,
      profession: r.category?.name || '',
      reagents: r.reagents?.map(reagent => ({
        id: reagent.reagent?.id,
        name: reagent.reagent?.name,
        quantity: reagent.quantity
      })) || []
    };
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const token = await getToken();
    const itemIds = await fetchItemIds(token);
    const recipeIds = await fetchRecipeIndex(token);
    const results = {};
    const recipeMap = {};

    console.log(`📦 Found ${itemIds.length} items and ${recipeIds.length} recipes...`);

    // Step 1: Build a map of crafted items
    for (let i = 0; i < recipeIds.length; i++) {
      const recipe = await fetchRecipeData(recipeIds[i], token);
      if (recipe) {
        recipeMap[recipe.craftedItemId] = {
          profession: recipe.profession,
          reagents: recipe.reagents
        };
      }

      if (i % 100 === 0) {
        console.log(`🔧 Processed ${i} / ${recipeIds.length} recipes`);
      }

      await delay(75);
    }

    // Step 2: Enrich items
    for (let i = 0; i < itemIds.length; i++) {
      const item = await fetchItemData(itemIds[i], token);
      if (item) {
        if (recipeMap[item.id]) {
          item.craftedBy = recipeMap[item.id];
        }
        results[item.id] = item;
      }

      if (i % 100 === 0) {
        console.log(`📥 Processed ${i} / ${itemIds.length} items`);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
      }

      await delay(75);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`✅ Done. Saved ${Object.keys(results).length} items to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
})();
