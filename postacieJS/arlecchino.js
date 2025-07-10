// arlecchino.js

// ————— menu (hamburger + overlay) —————
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay    = document.querySelector('.menu-overlay');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  overlay   .classList.toggle('open');
});
overlay.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  overlay   .classList.remove('open');
});

// ————— smooth scroll —————
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ————— derive current character from URL —————
const slug = window.location.pathname
  .split('/')
  .pop()
  .replace('.html','');
const currentCharacter = slug.charAt(0).toUpperCase() + slug.slice(1);

// ————— Weapons rendering —————
fetch('/postacieJS/weapons.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => renderWeapons(data.weapon))
  .catch(err => console.error('Error fetching weapons:', err));

function renderWeapons(items) {
  const weaponsList = document.querySelector('ul.weapon-list');
  if (!weaponsList) return console.error('Missing ul.weapon-list in DOM');
  weaponsList.innerHTML = '';

  items.forEach((item, idx) => {
    const li   = document.createElement('li');
    const link = document.createElement('a');
    link.href  = item.link || '#';

    const img = document.createElement('img');
    img.src   = item.image;
    img.alt   = item.name || item.weaponName;

    const h4 = document.createElement('h4');
    h4.textContent = item.name || item.weaponName;

    const p = document.createElement('p');
    p.textContent = item.describe;

    link.append(img);
    li.append(link, h4, p);
    weaponsList.appendChild(li);

    setTimeout(() => li.classList.add('show'), idx * 150);
  });
}

// ————— render artifacts for currentCharacter —————
fetch('/postacieJS/Recartifacts.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    const charData = data.characters.find(c => c.name === currentCharacter);
    if (!charData) {
      console.error(`No artifacts found for ${currentCharacter}`);
      return;
    }
    renderArtifacts(charData.artifacts);
  })
  .catch(err => console.error('Error fetching artifacts:', err));

function renderArtifacts(items) {
  const list = document.getElementById('artifactsList');
  if (!list) return console.error('Missing #artifactsList in DOM');
  list.innerHTML = '';

  items.forEach((item, i) => {
    const li   = document.createElement('li');
    const link = document.createElement('a');
    link.href  = item.link || '#';

    const title = document.createElement('h3');
    title.textContent = item.artifactName;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.artifactName;

    const desc = document.createElement('p');
    desc.textContent = item.describe;

    link.append(img);
    li.append(title, link, desc);
    list.appendChild(li);

    setTimeout(() => li.classList.add('show'), i * 150);
  });
}

// ————— Teams rendering —————
fetch('/postacieJS/rTeams.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => renderTeams(data.characters))
  .catch(err => console.error('Error fetching teams:', err));

function renderTeams(combos) {
  const section = document.getElementById('rTeams');
  if (!section) return console.error('Missing #rTeams in DOM');

  const heading2 = section.querySelector('h2');
  section.innerHTML = '';
  section.appendChild(heading2);

  const mainChar = {
    name:  currentCharacter,
    image: `/img/portretyZdj/p${slug}.png`,
    link:  `${slug}.html`
  };

  combos.forEach(comboObj => {
    const comboName = Object.keys(comboObj)[0];
    const members   = comboObj[comboName];

    const h3 = document.createElement('h3');
    h3.textContent = comboName;

    const ul = document.createElement('ul');
    ul.classList.add('team-list');

    [mainChar, ...members].forEach(item => {
      const li   = document.createElement('li');
      const link = document.createElement('a');
      link.href  = item.link || '#';

      const img = document.createElement('img');
      img.src   = item.image;
      img.alt   = item.name;

      const nameEl = document.createElement('h4');
      nameEl.textContent = item.name;

      link.append(img);
      li.append(link, nameEl);
      ul.appendChild(li);
    });

    section.appendChild(h3);
    section.appendChild(ul);
  });
}

// ————— Talents rendering —————
fetch('/postacieJS/talents.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
    const charData = data.talents.find(t => t.character === currentCharacter);
    if (!charData) {
      console.error(`Missing talents for: ${currentCharacter}`);
      return;
    }
    renderTalents(charData.talents);
  })
  .catch(err => console.error('Error fetching talents:', err));

function renderTalents(talentsObj) {
  const talentsList = document.getElementById('talentsList');
  const passiveList = document.getElementById('passiveList');
  if (!talentsList || !passiveList) {
    return console.error('Missing #talentsList or #passiveList in DOM');
  }
  talentsList.innerHTML = '';
  passiveList.innerHTML = '';

  ['normalAttack','elementalSkill','elementalBurst'].forEach((key, idx) => {
    const info = talentsObj[key];
    if (!info) return;

    const li = document.createElement('li');
    li.className = 'talent-item';

    const img = document.createElement('img');
    img.src = info.icon;
    img.alt = info.name;

    const h4 = document.createElement('h4');
    h4.textContent = info.name;

    const p = document.createElement('p');
    p.textContent = info.description;

    li.append(img, h4, p);
    talentsList.appendChild(li);
    setTimeout(() => li.classList.add('show'), idx * 100);
  });

  (talentsObj.passiveTalents || []).forEach((pt, i) => {
    const li = document.createElement('li');
    li.className = 'talent-item';

    const img = document.createElement('img');
    img.src = pt.icon;
    img.alt = pt.name;

    const h4 = document.createElement('h4');
    h4.textContent = pt.name;

    const p = document.createElement('p');
    p.textContent = pt.description;

    li.append(img, h4, p);
    passiveList.appendChild(li);
    setTimeout(() => li.classList.add('show'), i * 100);
  });
}

 const mainName = currentCharacter.toLocaleLowerCase();


function renderMainPic(mainName){
  
    const mainPic = document.querySelector('.character-figure');
    const placeMainName = document.querySelector('.logo');
    
    const mainImg = document.createElement('img');

    placeMainName.textContent = currentCharacter;
    
    mainImg.src = `img/zdj/${mainName}.png`;
    mainImg.alt = `${mainName} portret`
    mainImg.classList.add("character-image");

  
   
    mainPic.appendChild(mainImg);
    
  console.log(mainImg);

}

renderMainPic(mainName);
