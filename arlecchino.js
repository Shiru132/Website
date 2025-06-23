const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay    = document.querySelector('.menu-overlay');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  overlay.classList.toggle('open');
});


overlay.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
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


// Weapons rendering
fetch('/naukaJS/weapons.json')
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  })
  .then(data => {
  
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
    
    renderArtifacts(data.artifacts);
  })
  .catch(err => console.error('Error fetching JSON:', err));

function renderArtifacts(items) {
  const artifactsList = document.getElementById('artifactsList');
  if (!artifactsList) {
    console.error('Missing #artifactsList in DOM');
    return;
  }

  artifactsList.innerHTML = ''; 

  items.forEach((item, idx) => {
    const li   = document.createElement('li');
    const link = document.createElement('a');
    link.href  = item.link || '#';
    const h3 = document.createElement('h3');
    h3.textContent = item.artifactName;
    artifactsList.appendChild(h3);
    
   
    item.images.forEach(src => {
      const img = document.createElement('img');
      img.src   = src;
      img.alt   = item.artifactName; 
      link.appendChild(img);
    });

    const p = document.createElement('p');
    p.textContent = item.description;

 
    li.append(link);
    artifactsList.appendChild(li);
    artifactsList.appendChild(p);

  
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
    
    renderTeams(data.characters);
  })
  .catch(err => console.error('Error fetching JSON:', err));


function renderTeams(combos) {
  
  const section = document.getElementById('rTeams');
  if (!section) return console.error('Missing .card card-teams in DOM');


  const heading2 = section.querySelector('h2');
  section.innerHTML = '';
  section.appendChild(heading2);


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

    const comboName = Object.keys(comboObj)[0];
    const members   = comboObj[comboName];

 
    const h3 = document.createElement('h3');
    h3.textContent = comboName;
    section.appendChild(h3);

    // create a new <ul class="team-list">
    const ul = document.createElement('ul');
    ul.classList.add('team-list');
    section.appendChild(ul);

  
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

//talents render
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

 
  ['normalAttack', 'elementalSkill', 'elementalBurst'].forEach((cat, catIdx) => {
    const info = talentsObj[cat];
    if (!info) return;

   
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

 //render passive talents
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
