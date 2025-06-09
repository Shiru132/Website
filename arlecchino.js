const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay    = document.querySelector('.menu-overlay');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  overlay.classList.toggle('open');
});

// Optionally, clicking outside the menu (on the overlay) also closes it:
overlay.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
});


// Smooth scroll for internal anchor links
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


// Weapons rendering
fetch('/naukaJS/weapons.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    // pass the array under the "weapon" key to the renderer
    renderWeapons(data.weapon);
  })
  .catch(err => console.error('Error fetching JSON:', err));

function renderWeapons(items) {
  const weaponsList = document.querySelector('ul.weapon-list');
  if (!weaponsList) return console.error('Missing ul.weapon-list in DOM');
  weaponsList.innerHTML = '';

  items.forEach((item, idx) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.link || '#';

    const img = document.createElement('img');
    img.src = item.image;
    // set the alt text to the weapon title
    img.alt = item.name || item.weaponName;

    const h4 = document.createElement('h4');
    // use the name field, or if absent, weaponName
    h4.textContent = item.name || item.weaponName;

    const p = document.createElement('p');
    p.textContent = item.description;

    weaponsList.append(h4);
    li.append(link, p);
    link.append(img);
    weaponsList.append(li);

    setTimeout(() => li.classList.add('show'), idx * 150);
  });
}


// Artifacts rendering
fetch('/naukaJS/artifacts.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    // pass the array under the "artifacts" key to the renderer
    renderArtifacts(data.artifacts);
  })
  .catch(err => console.error('Error fetching JSON:', err));

function renderArtifacts(items) {
  const artifactsList = document.getElementById('artifactsList');
  if (!artifactsList) {
    console.error('Missing #artifactsList in DOM');
    return;
  }

  artifactsList.innerHTML = ''; // clear existing content

  items.forEach((item, idx) => {
    const li   = document.createElement('li');
    const link = document.createElement('a');
    link.href  = item.link || '#';
    const h3 = document.createElement('h3');
    h3.textContent = item.artifactName;
    artifactsList.appendChild(h3);
    
    // iterate through each image source
    item.images.forEach(src => {
      const img = document.createElement('img');
      img.src   = src;
      img.alt   = item.artifactName; 
      link.appendChild(img);
    });

    const p = document.createElement('p');
    p.textContent = item.description;

    // assemble the <li> content
    li.append(link);
    artifactsList.appendChild(li);
    artifactsList.appendChild(p);

    // staggered entry animation
    setTimeout(() => li.classList.add('show'), idx * 150);
  });
}

    
// Teams rendering
fetch('/naukaJS/rTeams.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    // data.characters is an array of objects: [{Hypercarry:[…]}, {Hyperbloom:[…]}, …]
    renderTeams(data.characters);
  })
  .catch(err => console.error('Error fetching JSON:', err));


function renderTeams(combos) {
  // Select the section where we append the groups
  const section = document.getElementById('rTeams');
  if (!section) return console.error('Missing .card card-teams in DOM');

  // Clear everything except the <h2> section title
  const heading2 = section.querySelector('h2');
  section.innerHTML = '';
  section.appendChild(heading2);

  // Derive slug from the URL, e.g. "arlecchino.html" → "Arlecchino"
  const slug = window.location.pathname
                 .split('/')
                 .pop()
                 .replace('.html','');
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Define the main character based on the current page
  const mainChar = {
    name,
    image: `/strona/portretyZdj/p${slug}.png`,
    link:  `${slug}.html`
  };

  combos.forEach(comboObj => {
    // extract the combination name and its array of members
    const comboName = Object.keys(comboObj)[0];
    const members   = comboObj[comboName];

    // create a <h3> for the combination name
    const h3 = document.createElement('h3');
    h3.textContent = comboName;
    section.appendChild(h3);

    // create a new <ul class="team-list">
    const ul = document.createElement('ul');
    ul.classList.add('team-list');
    section.appendChild(ul);

    // build an array: [mainChar, ...members]
    [mainChar, ...members].forEach((item) => {
      const li = document.createElement('li');

      const link = document.createElement('a');
      link.href = item.link || '#';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;

      const nameEl = document.createElement('h4');
      nameEl.textContent = item.name;

      link.appendChild(img);
      li.append(link, nameEl);
      ul.appendChild(li);
    });
  });
}

// Helper to convert keys like "elementalSkill" → "Elemental Skill"
function prettifyCategory(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

const slug = window.location.pathname
  .split('/')
  .pop()
  .replace('.html', '');
const currentCharacter = slug.charAt(0).toUpperCase() + slug.slice(1);

// Fetch and render talents based on the current character
fetch('/naukaJS/talents.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    const charData = data.talents.find(t => t.character === currentCharacter);
    if (!charData) {
      console.error(`Missing talents for character: ${currentCharacter}`);
      return;
    }
    renderTalents(charData.talents);
  })
  .catch(err => console.error('Error fetching JSON:', err));


function renderTalents(talentsObj) {
  const talentsList = document.getElementById('talentsList');
  const passiveList = document.getElementById('passiveList');
  if (!talentsList || !passiveList) {
    console.error('Missing #talentsList or #passiveList in DOM');
    return;
  }
  talentsList.innerHTML = '';
  passiveList.innerHTML  = '';

  // 1) Render Normal Attack, Elemental Skill, and Elemental Burst
  ['normalAttack', 'elementalSkill', 'elementalBurst'].forEach((cat, catIdx) => {
    const info = talentsObj[cat];
    if (!info) return;

    // Render each talent object (wrapped in an array for consistency)
    [info].forEach((talent, idx) => {
      const li = document.createElement('li');
      li.className = 'talent-item';

      const img = document.createElement('img');
      img.src = talent.icon;
      img.alt = talent.name;

      const h4 = document.createElement('h4');
      h4.textContent = talent.name;

      const p = document.createElement('p');
      p.textContent = talent.description;

      li.append(img, h4, p);
      talentsList.appendChild(li);

      setTimeout(() => li.classList.add('show'), (catIdx * 3 + idx) * 100);
    });
  });

  // 2) Render Passive Talents
  const passives = talentsObj.passiveTalents || [];
  passives.forEach((talent, idx) => {
    const li = document.createElement('li');
    li.className = 'talent-item';

    const img = document.createElement('img');
    img.src = talent.icon;
    img.alt = talent.name;

    const h4 = document.createElement('h4');
    h4.textContent = talent.name;

    const p = document.createElement('p');
    p.textContent = talent.description;

    li.append(img, h4, p);
    passiveList.appendChild(li);

    setTimeout(() => li.classList.add('show'), idx * 100);
  });
}
