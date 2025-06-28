export function initModal() {
  const overlay = document.getElementById('artifactModal');
  overlay.querySelector('.modal-close')
         .addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
}

export function openModal(item) {
  const overlay = document.getElementById('artifactModal');
  overlay.querySelector('.modal-image').src = item.image;
  overlay.querySelector('.modal-title').textContent = item.name;
  overlay.querySelector('.modal-desc').textContent = item.description;
  overlay.classList.remove('hidden');
}
