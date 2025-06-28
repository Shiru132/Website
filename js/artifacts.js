// artefakty.js

(async function fetchDataFromApi() {
  try {
    // Fetch list of artifact IDs
    const idsRes = await fetch('https://genshin.jmp.blue/artifacts');
    if (!idsRes.ok) throw new Error(`Nie udało się pobrać listy zestawów: ${idsRes.status}`);
    const artifactIds = await idsRes.json();

    // fetch local json
    const imageDataRes = await fetch('/naukajs/artifacts.json');
    if (!imageDataRes.ok) throw new Error(`Błąd pobierania lokalnego JSON: ${imageDataRes.status}`);
    const { artifacts: localArr } = await imageDataRes.json();

    //  Normalize
    const normalize = str =>
      str.toLowerCase()
         .replace(/[-’'"]/g, '')
         .replace(/\s+/g, '')
         .trim();

    // data for each artifact
    const artifacts = await Promise.all(
      artifactIds.map(async (id, idx) => {
        const res  = await fetch(`https://genshin.jmp.blue/artifacts/${id}`);
        if (!res.ok) throw new Error(`Błąd pobierania danych dla ${id}: ${res.status}`);
        const meta = await res.json();

        const localEntry = localArr.find(e =>
          normalize(e.artifactName) === normalize(meta.name)
        );
        const imageUrl = localEntry ? localEntry.image : '';

        console.log(`${idx}: ${imageUrl}`);

        const description = [
          `Max Rarity: ${meta.max_rarity}`,
          `2-piece bonus: ${meta['2-piece_bonus']}`,
          `4-piece bonus: ${meta['4-piece_bonus']}`,
          localEntry?.describe
        ].filter(Boolean).join(' | ');

        return { name: meta.name, image: imageUrl, description };
      })
    );

    renderArtifacts(artifacts);
    
    searchingByName();

  } catch (err) {
    console.error('Init error:', err);
  }
})();


/**
 * Renders list items
 * @param {Array<{name:string, image:string, description:string}>} list
 */
function renderArtifacts(list) {
  const ul = document.querySelector('ul.artifacts-list');
  ul.innerHTML = '';

  list.forEach(item => {
    const li    = document.createElement('li');
    const title = document.createElement('h3');
    const desc  = document.createElement('p');
    const img   = document.createElement('img');

    title.textContent = item.name;
    if (item.name === 'Sacrifieur to the Firmament') {
      li.classList.add('future-artifact');
    }

    li.classList.add('artifact-li');
    title.classList.add('artifact-name');
    desc.classList.add('artifact-description', 'hidden');

    img.classList.add('artifact-image');
    img.src = item.image;
    img.alt = item.name;

    desc.textContent = item.description;
    li.append(img, title, desc);
    li.addEventListener('click', () => openModal(item));
    ul.appendChild(li);
  });
}


// searching
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  const debouncedSearch = debounce(searchingByName, 150);
  searchInput.addEventListener('input', debouncedSearch);
}

// filter 
function searchingByName() {
  const filter = searchInput.value.trim().toLowerCase();
  const items = Array.from(document.querySelectorAll('.artifact-li'));
  const visibleItems = [];

  items.forEach(item => {
    const title = item.querySelector('.artifact-name').textContent.toLowerCase();
    if (title.includes(filter)) {
      item.classList.remove('hidden');
      visibleItems.push(item);
    } else {
      item.classList.add('hidden');
    }
  });

  visibleItems.forEach((li, idx) => {
    li.style.setProperty('--delay', `${idx * 30}ms`);
  });
}

// debounce
function debounce(fn, delay = 200) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}


// Modal
const modalOverlay = document.getElementById('artifactModal');
const modalImg     = modalOverlay.querySelector('.modal-image');
const modalTitle   = modalOverlay.querySelector('.modal-title');
const modalDesc    = modalOverlay.querySelector('.modal-desc');
const modalClose   = modalOverlay.querySelector('.modal-close');

function openModal(item) {
  modalImg.src = item.image;
  modalImg.alt = item.name;
  modalTitle.textContent = item.name;
  modalDesc.textContent = item.description;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
