const characters = [
        { name: "Neuvillette", image: "/strona/zdj/neuvillette.png", element: "hydro", link: "neuvillette.html" },
        { name: "Clorinde", image: "/strona/zdj/clorinde.png", element: "electro", link: "clorinde.html" },
        { name: "Furina", image: "/strona/zdj/furina.png", element: "hydro", link: "furina.html" },
        { name: "Arlecchino", image: "/strona/zdj/arlecchino.png", element: "pyro", link: "arlecchino.html" },
        { name: "Mona", image: "/strona/zdj/mona.png", element: "hydro", link: "mona.html" },
        { name: "Navia", image: "/strona/zdj/navia.png", element: "geo", link: "navia.html" },
        { name: "Shogun", image: "/strona/zdj/shogun.png", element: "electro", link: "shogun.html" },
        { name: "Yae Miko", image: "/strona/zdj/yae-miko.png", element: "electro", link: "yae-miko.html" },
        { name: "Kazuha", image: "/strona/zdj/kazuha.png", element: "anemo", link: "kazuha.html" },
        { name: "Diluc", image: "/strona/zdj/diluc.png", element: "pyro", link: "diluc.html" },
        { name: "Jean", image: "/strona/zdj/jean.png", element: "anemo", link: "jean.html" },
        { name: "Yelan", image: "/strona/zdj/yelan.png", element: "hydro", link: "yelan.html" },
        { name: "Nahida", image: "/strona/zdj/nahida.png", element: "dendro", link: "nahida.html" },
        { name: "Keqing", image: "/strona/zdj/keqing.png", element: "electro", link: "keqing.html" },
        { name: "Alhaitham", image: "/strona/zdj/alhaitham.png", element: "dendro", link: "alhaitham.html" },
        { name: "Chasca", image: "/strona/zdj/chasca.png", element: "anemo", link: "chasca.html" },
        { name: "Citlali", image: "/strona/zdj/citlali.png", element: "cryo", link: "citlali.html" },
        { name: "Hu Tao", image: "/strona/zdj/hu-tao.png", element: "pyro", link: "hu-tao.html" },
        { name: "Kinich", image: "/strona/zdj/kinich.png", element: "dendro", link: "kinich.html" },
        { name: "Mualani", image: "/strona/zdj/mualani.png", element: "hydro", link: "mualani.html" },
        { name: "Shenhe", image: "/strona/zdj/shenhe.png", element: "cryo", link: "shenhe.html" },
        { name: "Wriothesley", image: "/strona/zdj/wriothesley.png", element: "cryo", link: "wriothesley.html" },
        { name: "Xiangling", image: "/strona/zdj/xiangling.png", element: "pyro", link: "xiangling.html" },
        { name: "Xilonen", image: "/strona/zdj/xilonen.png", element: "geo", link: "xilonen.html" },
        { name: "Zhongli", image: "/strona/zdj/zhongli.png", element: "geo", link: "zhongli.html" },
        { name: "Lyney", image: "/strona/zdj/lyney.png", element: "pyro", link: "lyney.html" },
        { name: "Ganyu", image: "/strona/zdj/ganyu.png", element: "cryo", link: "ganyu.html" },
        { name: "Eula", image: "/strona/zdj/eula.png", element: "cryo", link: "eula.html" },
        { name: "Emilie", image: "/strona/zdj/emilie.png", element: "dendro", link: "emilie.html" },
        { name: "Bennett", image: "/strona/zdj/bennett.png", element: "pyro", link: "bennett.html" },
        { name: "Nilou", image: "/strona/zdj/nilou.png", element: "hydro", link: "nilou.html" },
        { name: "Tighnari", image: "/strona/zdj/tighnari.png", element: "dendro", link: "tighnari.html" }
    ];
 
    const characterGallery = document.getElementById("gallery");
const filter           = document.querySelector(".filter-select");
const searchInput      = document.querySelector(".search-input");

// 2. Rendering
function renderGallery(list) {
  characterGallery.innerHTML = "";
  list.forEach((char, idx) => {
    const li = document.createElement("li");
    li.className = "character-card";
    

    li.id        = char.element;
    li.classList.add(`element-${char.element}`);

    const link    = document.createElement("a");
    link.href     = char.link;
    const img     = document.createElement("img");
    img.src       = char.image;
    img.alt       = char.name;
    img.className = "character-image";

    const nameDiv      = document.createElement("div");
    nameDiv.className  = "character-name";
    nameDiv.textContent = char.name;
    
  img.addEventListener('load', () => {
    extractThemeColor(img, ({ r, g, b, css }) => {
     //colored cards by element
      li.style.setProperty('--theme-color', css);
      
      li.style.setProperty('--theme-color-rgb', `${r},${g},${b}`);
    });
  });

    link.append(img, nameDiv);
    li.append(link);
    characterGallery.append(li);

    // falowe pojawianie
    setTimeout(() => {
      li.classList.add("show");
    }, idx * 150);
  });
}

// Sorting by name
const sorted = [...characters].sort((a,b) => a.name.localeCompare(b.name));
renderGallery(sorted);


filter.addEventListener("change", () => {
  const value    = filter.value;
  const allCards = [...characterGallery.querySelectorAll("li")];

 
  allCards.forEach(li => {
    li.classList.remove("show");
    li.classList.add("hidden");
  });

//showing by element
  const toShow = value === "all"
    ? allCards
    : allCards.filter(li => li.id === value);

  // falowe pokazanie
  toShow.forEach((li, idx) => {
    setTimeout(() => {
      li.classList.remove("hidden");
      li.classList.add("show");
    }, idx * 150);
  });
});

 //Searching characters
function fullFilter() {
  const term  = searchInput.value.trim().toLowerCase();
  const value = filter.value;
  const all   = [...characterGallery.querySelectorAll('li')];

  
  all.forEach(li => {
    li.classList.remove('show');
    li.classList.add('hidden');
  });

 
  let toShow = all.filter(li =>
    li.querySelector('.character-name')
      .textContent
      .toLowerCase()
      .includes(term)
  );

  
  if (value !== 'all') {
    toShow = toShow.filter(li => li.id === value);
  }

  // nadaj delay
  toShow.forEach((li, idx) => {
    li.style.setProperty('--delay', `${idx * 30}ms`);
  });

  // falowe pokazanie
  requestAnimationFrame(() => {
    toShow.forEach(li => {
      li.classList.remove('hidden');
      li.classList.add('show');
    });
  });

  // brak wyników
  const msg = characterGallery.querySelector('.NoSearchingResult');
  if (!toShow.length) {
    if (!msg) {
      const p = document.createElement('p');
      p.className   = 'NoSearchingResult';
      p.textContent = 'Brak wyników';
      characterGallery.append(p);
    }
  } else if (msg) {
    msg.remove();
  }
}


// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedFilter = debounce(applyFilter, 200);
searchInput.addEventListener("input", debouncedFilter);

      //hamburger
    const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.menu-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        function toggleMenu() {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        }

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });


        
const scrollBtn = document.querySelector('.scroll-to-top');

// showing when reach 300px
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

// smooth
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

  // adiing elemental color
function extractThemeColor(imgEl, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(imgEl, 0, 0, 1, 1);

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  callback({ r, g, b, css: `rgb(${r},${g},${b})` });
}
const debounced = debounce(fullFilter, 200);
searchInput.addEventListener('input', debounced);

filter.addEventListener('change', fullFilter);





