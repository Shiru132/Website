// artefakty.js

(async function fetchDataFromApi() {
  try {
    // 1) fetch list of artifact IDs
    const idsRes = await fetch('https://genshin.jmp.blue/artifacts');
    if (!idsRes.ok) throw new Error(`Nie udało się pobrać listy zestawów: ${idsRes.status}`);
    const artifactIds = await idsRes.json(); // ["adventurer","archaic-petra",...]

    // 2) fetch local artifacts.json
    const imageDataRes = await fetch('/naukajs/artifacts.json');
    if (!imageDataRes.ok) throw new Error(`Błąd pobierania lokalnego JSON: ${imageDataRes.status}`);
    const { artifacts: localArr } = await imageDataRes.json(); // tablica obiektów

    // 3) normalize function for artifact names
    const normalize = str =>
      str
        .toLowerCase()
        .replace(/[-’'"]/g, '')  // delete - "" and apostrophes
        .replace(/\s+/g, '')     // delete spaces
        .trim();

    // data to artifacts
    const artifacts = await Promise.all(
      artifactIds.map(async (id, idx) => {
        //  fetch  z API
        const res  = await fetch(`https://genshin.jmp.blue/artifacts/${id}`);
        if (!res.ok) throw new Error(`Błąd pobierania danych dla ${id}: ${res.status}`);
        const meta = await res.json();

        // find local image by normalized name
        const localEntry = localArr.find(e =>
          normalize(e.artifactName) === normalize(meta.name)
        );
        const imageUrl   = localEntry ? localEntry.image : '';

        // image status testing
        console.log(`${idx}: ${imageUrl}`);

        // data to description
        const description = [
          `Max Rarity: ${meta.max_rarity}`,
          `2-piece bonus: ${meta['2-piece_bonus']}`,
          `4-piece bonus: ${meta['4-piece_bonus']}`,
          localEntry?.describe
        ]
          .filter(Boolean)
          .join(' | ');

        return {
          name:        meta.name,
          image:       imageUrl,
          description
        };
      })
    );

    
    renderArtifacts(artifacts);

  } catch (err) {
    console.error('Init error:', err);
  }
})();


/**
 * li rendering
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
    desc.textContent  = item.description;

    img.src = item.image;
    img.alt = item.name;

    li.addEventListener('click', () => openModal(item));

    li.append(img,title, desc );
    ul.appendChild(li);

    
  });
}


// searching 
  const listEl = document.getElementById('artifactList');
    const searchInput = document.getElementById('searchInput');

function searchingByName() {
  const input = document.querySelector('.search');
  const filter = input.value.toLowerCase();
  const items = document.querySelectorAll('.artifact-li');

  items.forEach(item => {
    const title = item.querySelector('.artifact-name').textContent.toLowerCase();
    
    if (title.includes(filter)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}
searchInput.addEventListener('input', searchingByName);

// Inspect
const modalOverlay = document.getElementById('artifactModal');
const modalImg     = modalOverlay.querySelector('.modal-image');
const modalTitle   = modalOverlay.querySelector('.modal-title');
const modalDesc    = modalOverlay.querySelector('.modal-desc');
const modalClose   = modalOverlay.querySelector('.modal-close');

function openModal(item) {
  modalImg.src  = item.image;
  modalImg.alt  = item.name;
  modalTitle.textContent = item.name;
  modalDesc.textContent  = item.description;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
