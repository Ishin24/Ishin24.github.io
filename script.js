// ---------------------------------------------------------
// Theme toggle (light / dark)
// ---------------------------------------------------------
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark');
  themeToggle.setAttribute('aria-pressed', 'true');
}

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.setAttribute('aria-pressed', 'false');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  }
});

// ---------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.querySelector('.site-nav.mobile');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------
// Word lookup
// ---------------------------------------------------------
const fetchDefinitionButton = document.getElementById('fetch-definition');
const wordInput = document.getElementById('word-input');
const definitionResult = document.getElementById('definition-result');

async function lookupWord() {
  const word = wordInput.value.trim();
  if (!word) {
    definitionResult.innerHTML = '<p>Enter a word first.</p>';
    return;
  }

  definitionResult.innerHTML = '<p class="muted">Looking that up…</p>';

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();

    const meanings = data[0].meanings
      .map((meaning) => `
        <p><strong>${meaning.partOfSpeech}</strong> — ${meaning.definitions[0].definition}</p>
      `)
      .join('');

    definitionResult.innerHTML = `<h3>${data[0].word}</h3>${meanings}`;
  } catch (error) {
    definitionResult.innerHTML = '<p>Couldn\u2019t find that word. Try another one.</p>';
    console.error('Error fetching word definition:', error);
  }
}

fetchDefinitionButton.addEventListener('click', lookupWord);
wordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') lookupWord();
});

// ---------------------------------------------------------
// Active nav link on scroll
// ---------------------------------------------------------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a');

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isMatch);
  });
};

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveLink(visible.target.id);
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  sections.forEach((section) => observer.observe(section));
}
