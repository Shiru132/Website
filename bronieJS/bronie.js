let selectedRarity = null;
let selectedType   = null;

document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initHamburgerMenu();
  initSearch(filterArtifacts);

  const fourBtn    = document.getElementById('four');
  const fiveBtn    = document.getElementById('five');
  const typeFilters = document.querySelectorAll('.weapon-filters-type li[data-type]');

  fourBtn.addEventListener('click', () => {
    selectedRarity = '4star';
    applyFilters();
  });
  fiveBtn.addEventListener('click', () => {
    selectedRarity = '5star';
    applyFilters();
  });

  typeFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      selectedType = filter.dataset.type.toLowerCase();
      applyFilters();
    });
  });

  // Fetch, render and then apply any current filters (initially none, so shows all ≥4★)
  fetchDataFromApi().then(() => {
    applyFilters();
  });
});

async function fetchDataFromApi() {
  try {
    const idsRes = await fetch('https://genshin.jmp.blue/weapons');
    if (!idsRes.ok) throw new Error(`Nie udało się pobrać listy: ${idsRes.status}`);
    const artifactIds = await idsRes.json();

    const weapons = await Promise.all(
      artifactIds.map(async id => {
        const res = await fetch(`https://genshin.jmp.blue/weapons/${id}`);
        if (!res.ok) throw new Error(`Błąd pobierania ${id}: ${res.status}`);
        const meta = await res.json();
        const description = [
          `Rarity: ${meta.rarity}`,
          `Description: ${meta.passiveDesc}`,
          `How to get: ${meta.location}`
        ].filter(Boolean).join(' | ');

        return {
          name: meta.name,
          description,
          rar:  meta.rarity,
          type: meta.type
        };
      })
    );

    renderWeapons(weapons);

  } catch (err) {
    console.error('Init error:', err);
  }
}

function renderWeapons(list) {
  const ul = document.querySelector('ul.weapons-list');
  ul.innerHTML = '';

  list.forEach(item => {
    if (item.rar < 4) return;

    const li    = document.createElement('li');
    const title = document.createElement('h3');
    const desc  = document.createElement('p');
    const img   = document.createElement('img');

    title.textContent = item.name;
    img.src           = `/strona/bronieZdj/${item.name.replace(/ /g,'')}.png`;
    img.alt           = item.name;
    desc.textContent  = item.description;

    li.classList.add('weapon-li', `weapon-${item.rar}star`);
    li.id = item.type.toLowerCase();
    title.classList.add('weapon-name');
    desc.classList.add('weapon-description', 'hidden');

    li.append(img, title, desc);
    li.addEventListener('click', () => openModal(item));
    ul.appendChild(li);
  });
}

function applyFilters() {
  const weaponItems = document.querySelectorAll('ul.weapons-list li.weapon-li');

  weaponItems.forEach(li => {
    const matchesRarity = selectedRarity
      ? li.classList.contains(`weapon-${selectedRarity}`)
      : true;
    const matchesType = selectedType
      ? li.id === selectedType
      : true;

    li.classList.toggle('hidden', !(matchesRarity && matchesType));
  });
}

function showByRarity(e) {
  // (zostawione tylko dla kompatybilności, nie ma wywołań)
  const wanted = e.currentTarget.id === 'four' ? '4star' : '5star';
  document.querySelectorAll('ul.weapons-list li.weapon-li')
          .forEach(li => {
            li.classList.toggle('hidden',
              !li.classList.contains(`weapon-${wanted}`)
            );
          });
}

function initSearch(onFilter) {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', debounce(() => {
    const q = input.value.trim().toLowerCase();
    onFilter(q);
    applyFilters();  // łączy wyszukiwanie z gwiazdkami + typem
  }, 150));
}

function filterArtifacts(query) {
  document.querySelectorAll('ul.weapons-list li.weapon-li')
    .forEach(li => {
      const name = li.querySelector('.weapon-name')?.textContent.toLowerCase() || '';
      const matchesText = name.includes(query);
      li.classList.toggle('hidden', !matchesText);
    });
}

function initModal() {
  const overlay = document.getElementById('weaponModal');
  if (!overlay) return console.error('Brak #weaponModal w DOM');

  overlay.querySelector('.modal-close')
         .addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
}

function openModal(item) {
  const overlay = document.getElementById('weaponModal');
  overlay.querySelector('.modal-image').src         = item.image;
  overlay.querySelector('.modal-title').textContent = item.name;
  overlay.querySelector('.modal-desc').textContent  = item.description;
  overlay.classList.remove('hidden');
}

function initHamburgerMenu({
  hamburgerSelector = '.hamburger',
  menuSelector      = '.mobile-menu',
  overlaySelector   = '.menu-overlay'
} = {}) {
  const hamb = document.querySelector(hamburgerSelector);
  const men  = document.querySelector(menuSelector);
  const ov   = document.querySelector(overlaySelector);
  if (!hamb || !men || !ov) return;

  hamb.addEventListener('click', () => {
    men.classList.toggle('open');
    ov.classList.toggle('open');
  });
  ov.addEventListener('click', () => {
    men.classList.remove('open');
    ov.classList.remove('open');
  });
}

function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
