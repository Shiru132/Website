import { openModal } from './modal.js';

/**
 * 
 * @param {Array<{name: string, image: string, description: string}>} list
 */
export function renderArtifacts(list) {
  
  const ul = document.querySelector('ul.artifacts-list');
  ul.innerHTML = '';

  list.forEach(item => {
    // Tworzenie elementów dom
    const li    = document.createElement('li');
    const img   = document.createElement('img');
    const title = document.createElement('h3');
    const desc  = document.createElement('p');

    // Ustawienie treści 
    title.textContent = item.name;
    img.src           = item.image;
    img.alt           = item.name;
    desc.textContent  = item.description;

    // Dodanie klas CSS
    li.classList.add('artifact-li');
    img.classList.add('artifact-image');
    title.classList.add('artifact-name');
    desc.classList.add('artifact-description', 'hidden');

    // future-artifact
    if (item.name === 'Sacrifieur to the Firmament') {
      li.classList.add('future-artifact');
    }

    
    li.addEventListener('click', () => openModal(item));

   
    li.append(img, title, desc);
    ul.appendChild(li);
  });
}

/**
 * Wyświetla komunikat o błędzie na stronie
 * @param {string} msg - Treść komunikatu
 */
export function showError(msg) {
  const container = document.querySelector('.menu-container') || document.body;
  const errorDiv  = document.createElement('div');
  errorDiv.classList.add('error');
  errorDiv.textContent = msg;
  container.prepend(errorDiv);
}
