import { iconMap } from './IconMap.js';

const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUgbmLaIQcadhPZSGf2nUBoSOhvcqMMoU0DPWlRUKmRrYHYtXsvWxGgqhWRjqpakry4VBTB2CHtMen/pub?gid=1592321778&single=true&output=csv';
const invTypeMap = {
  INVTYPE_HEAD: 'Helm',
  INVTYPE_SHOULDER: 'Shoulders',
  INVTYPE_CLOAK: 'Back',
  INVTYPE_CHEST: 'Chest',
  INVTYPE_ROBE: 'Chest',
  INVTYPE_WRIST: 'Wrists',
  INVTYPE_HAND: 'Hands',
  INVTYPE_WAIST: 'Waist',
  INVTYPE_LEGS: 'Legs',
  INVTYPE_FEET: 'Boots',
  INVTYPE_2HWEAPON: 'Main Hand',
  INVTYPE_WEAPON: 'Main Hand',
  INVTYPE_WEAPONMAINHAND: 'Main Hand',
  INVTYPE_WEAPONOFFHAND: 'Off-hand',
  INVTYPE_HOLDABLE: 'Off-hand',
  INVTYPE_SHIELD: 'Off-hand',
  INVTYPE_FINGER: 'Ring',
  INVTYPE_NECK: 'Neck', // Optional, not currently used
  INVTYPE_TRINKET: 'Trinket', // Optional
  INVTYPE_RANGEDRIGHT: 'Wand', // Optional
  INVTYPE_THROWN: 'Ranged', // Optional
  INVTYPE_NON_EQUIP_IGNORE: 'Misc',
  INVTYPE_BAG: 'Bag',
};

const professionIcons = {
  'Blacksmithing': 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
  'Leatherworking': 'https://wow.zamimg.com/images/wow/icons/large/trade_leatherworking.jpg',
  'Tailoring': 'https://wow.zamimg.com/images/wow/icons/large/trade_tailoring.jpg',
  'Engineering': 'https://wow.zamimg.com/images/wow/icons/large/trade_engineering.jpg',
  'Alchemy': 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
  'Jewelcrafting': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_01.jpg',
  'Enchanting': 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
  'Inscription': 'https://wow.zamimg.com/images/wow/icons/large/inv_inscription_tradeskill01.jpg'
};

const gearIcons = {
  'Helm': 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_06.jpg',
  'Shoulders': 'https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_02.jpg',
  'Back': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_cape_11.jpg',
  'Chest': 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_17.jpg',
  'Wrists': 'https://wow.zamimg.com/images/wow/icons/large/inv_bracer_17.jpg',
  'Hands': 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_17.jpg',
  'Waist': 'https://wow.zamimg.com/images/wow/icons/large/inv_belt_15.jpg',
  'Legs': 'https://wow.zamimg.com/images/wow/icons/large/inv_pants_cloth_21.jpg',
  'Boots': 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_05.jpg',
  'Main Hand': 'https://wow.zamimg.com/images/wow/icons/medium/inv_sword_24.jpg',
  'Off-hand': 'https://static.wikia.nocookie.net/wowpedia/images/5/5a/Inv_offhand_blood_02.png',
  'Ring': 'https://wow.zamimg.com/images/wow/icons/medium/inv_jewelry_ring_81.jpg',
  'Red Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_red.jpg',
  'Blue Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_blue.jpg',
  'Yellow Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_yellow.jpg',
  'Green Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_green.jpg',
  'Purple Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_purple.jpg',
  'Orange Gem': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_x4_rare_cut_orange.jpg',
  'Prismatic Gem': 'https://wow.zamimg.com/images/wow/icons/medium/inv_jewelcrafting_cut-standart-gem-hybrid_color1_3.jpg',
  'Meta Gem': 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gem_x4_metagem_cut.jpg',
  'Flask': 'https://wow.zamimg.com/images/wow/icons/medium/inv_flask_red.jpg',
  'Potion/Elixir': 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_107.jpg',
  'Glyph': 'https://wow.zamimg.com/images/wow/icons/medium/inv_glyph_minorhunter.jpg',
  'Transmutation': 'https://static.wikia.nocookie.net/wowpedia/images/7/7e/Spell_nature_abolishmagic.png'
};

let favouriteRows = JSON.parse(localStorage.getItem('favouriteRows') || '[]');
function saveFavourites() {
  localStorage.setItem('favouriteRows', JSON.stringify(favouriteRows));
}
function isFavourited(rowIndex) {
  return favouriteRows.includes(rowIndex);
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
let showingFavouritesOnly = false;
$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
  if (!showingFavouritesOnly) return true;
  return favouriteRows.includes(dataIndex);
});

function getParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}
function updateParam(key, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, '', url);
}

Papa.parse(sheetCSV, {
  download: true,
  header: true,
  complete: function(results) {
    const raw = results.data;

// Group by: Profession + Item/Enchant Name + Item ID + Spell ID
const grouped = {};
    raw.forEach(row => {
  const invType = row["Item Type"];
  row["Item Type"] = invTypeMap[invType] || invType; // fallback to original if unmapped
});

raw.forEach(row => {
  const key = `${row["Profession"]}|${row["Item/Enchant Name"]}|${row["Item ID"]}|${row["Spell ID"]}`;

  if (!grouped[key]) {
    grouped[key] = { ...row };
    grouped[key]["Crafter(s)"] = new Set(row["Crafter(s)"].split(',').map(s => s.trim()));
  } else {
    const crafters = row["Crafter(s)"].split(',').map(s => s.trim());
    crafters.forEach(c => grouped[key]["Crafter(s)"].add(c));
  }
});

// Final data array for DataTables
const data = Object.values(grouped).map(row => ({
  ...row,
  "Crafter(s)": [...row["Crafter(s)"]].sort().join(', ')
}));

    const table = $('#craftTable').DataTable({
      data: data,
      columns: [
        {
          title: '',
          data: null,
          orderable: false,
          render: function(data, type, row, meta) {
            const rowIndex = meta.row;
            const starClass = isFavourited(rowIndex) ? 'favourite-star favourited' : 'favourite-star';
            return `<div class="favourite-cell" data-row="${rowIndex}"><span class="${starClass}">★</span></div>`;
          }
        },
        {
          title: 'Profession',
          data: 'Profession',
          render: function(data) {
            const icon = professionIcons[data] || '';
            return icon ? `<img class="icon" src="${icon}" alt="">${data}` : data;
          }
        },
        {
          title: 'Item Type',
          data: 'Item Type',
          render: function(data) {
            const icon = gearIcons[data] || '';
            return icon ? `<img class="icon" src="${icon}" alt="">${data}` : data;
          }
        },
{
  title: 'Item/Enchant Name',
  data: null,
  render: function(row) {
    const name = row["Item/Enchant Name"];
    const id = row["Spell ID"];
    const icon = Number(row["Texture ID"]); // 🔥 FIX: ensure it's a number

    const iconName = iconMap[icon];
    const iconImg = iconName
      ? `<img src="https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg" class="icon" alt="" style="margin-right:4px; vertical-align:middle;">`
      : '';

    const displayName = id
      ? `<a href="https://www.wowhead.com/mop-classic/spell=${id}" data-wowhead="spell=${id}" class="wowhead-link">${name}</a>`
      : name;

    return iconImg + displayName;
  }
},

{
  title: 'Crafter(s)',
  data: 'Crafter(s)'
}
      ],
      columnDefs: [
        { targets: 0, orderable: false, width: '5%' },
        { targets: 1, width: '20%' },
        { targets: 2, width: '20%' },
        { targets: 3, width: '40%' }
      ],
      pageLength: 25,
      dom: 'lftip'
    });

    $('#craftTable thead th:first-child')
      .removeClass('sorting sorting_asc sorting_desc')
      .css('pointer-events', 'none')
      .css('background-image', 'none');

    $('#craftTable tbody').on('click', '.favourite-cell', function() {
      const rowIndex = parseInt($(this).data('row'), 10);
      if (favouriteRows.includes(rowIndex)) {
        favouriteRows = favouriteRows.filter(i => i !== rowIndex);
      } else {
        favouriteRows.push(rowIndex);
      }
      saveFavourites();
      table.row(rowIndex).invalidate().draw(false);
    });

    $('#favouriteToggle').on('click', function () {
      showingFavouritesOnly = !showingFavouritesOnly;
      table.draw();
      $(this).text(
        showingFavouritesOnly ? '⭐ Showing Favourites (Click to Show All)' : '⭐ Show Favourites Only'
      );
    });

    $('#clearFavourites').on('click', function () {
      if (!confirm('Are you sure you want to remove all favourites?')) return;
      favouriteRows = [];
      saveFavourites();
      if (showingFavouritesOnly) {
        showingFavouritesOnly = false;
        $('#favouriteToggle').text('⭐ Show Favourites Only');
      }
      table.rows().invalidate().draw(false);
      showToast('Favourites cleared');
    });

    const professions = [...new Set(data.map(row => row.Profession).filter(Boolean))].sort();
    professions.forEach(p => {
      $('#professionFilter').append(`<option value="${p}">${p}</option>`);
    });

    const allGearSlots = [...new Set(data.map(row => row["Item Type"]).filter(Boolean))].sort();
    const groupedGearSlots = {
      "Armor": ['Helm', 'Shoulders', 'Chest', 'Legs', 'Hands', 'Boots', 'Wrists', 'Waist'],
      "Weapon": ['Main Hand', 'Off-hand'],
      "Accessories": ['Back', 'Ring'],
      "Gems": ['Red Gem', 'Blue Gem', 'Yellow Gem', 'Purple Gem', 'Orange Gem', 'Green Gem', 'Prismatic Gem', 'Meta Gem']
    };
    const allGroupedSlots = Object.values(groupedGearSlots).flat();
    groupedGearSlots["Other"] = allGearSlots.filter(slot => !allGroupedSlots.includes(slot));
    for (const [group, options] of Object.entries(groupedGearSlots)) {
      const groupElem = $(`<optgroup label="${group}"></optgroup>`);
      options.forEach(opt => {
        groupElem.append(`<option value="${opt}">${opt}</option>`);
      });
      $('#gearSlotFilter').append(groupElem);
    }

    const itemNames = [...new Set(data.map(row => row["Item/Enchant Name"]).filter(Boolean))].sort();
    itemNames.forEach(i => {
      $('#itemFilter').append(`<option value="${i}">${i}</option>`);
    });

    const allCrafters = data.map(row => row["Crafter(s)"]).filter(Boolean).flatMap(c => c.split(',').map(name => name.trim()));
    const uniqueCrafters = [...new Set(allCrafters)].sort();
    uniqueCrafters.forEach(crafter => {
      $('#crafterFilter').append(`<option value="${crafter}">${crafter}</option>`);
    });

    const urlParams = {
      profession: getParam('profession'),
      gear: getParam('gear'),
      item: getParam('item'),
      crafter: getParam('crafter')
    };

    if (urlParams.profession) {
      table.column(1).search(urlParams.profession).draw();
      $('#professionFilter').val(urlParams.profession);
    }
    if (urlParams.gear) {
      table.column(2).search(urlParams.gear).draw();
      $('#gearSlotFilter').val(urlParams.gear);
    }
    if (urlParams.item) {
      table.column(3).search(urlParams.item).draw();
      $('#itemFilter').val(urlParams.item);
    }
    if (urlParams.crafter) {
      table.column(4).search(urlParams.crafter).draw();
      $('#crafterFilter').val(urlParams.crafter);
    }

    $('#professionFilter').on('change', function() {
      table.column(1).search(this.value).draw();
      updateParam('profession', this.value);
    });
    $('#gearSlotFilter').on('change', function() {
      table.column(2).search(this.value).draw();
      updateParam('gear', this.value);
    });
    $('#itemFilter').on('change', function() {
      table.column(3).search(this.value).draw();
      updateParam('item', this.value);
    });
    $('#crafterFilter').on('change', function() {
      table.column(4).search(this.value).draw();
      updateParam('crafter', this.value);
    });
    $('#globalSearch').on('keyup', function() {
      table.search(this.value).draw();
    });
  }
});







