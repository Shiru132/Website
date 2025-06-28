export function initSearch(onFilter) {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', debounce(() => {
    const q = input.value.trim().toLowerCase();
    onFilter(q);
  }, 150));
}

export function filterArtifacts(query) {
  const items = Array.from(document.querySelectorAll('.artifact-li'));
  const visible = [];
  items.forEach((li) => {
    const name = li.querySelector('.artifact-name').textContent.toLowerCase();
    if (name.includes(query)) {
      li.classList.remove('hidden');
      visible.push(li);
    } else {
      li.classList.add('hidden');
    }
  });
  visible.forEach((li, idx) =>
    li.style.setProperty('--delay', `${idx * 30}ms`)
  );
}
