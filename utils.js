export function normalize(str) {
  return str.toLowerCase()
            .replace(/[-’'"]/g, '')
            .replace(/\s+/g, '')
            .trim();
}

export function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
