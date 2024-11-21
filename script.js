const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

const menuToggle = document.createElement('button');
menuToggle.textContent = '☰';
menuToggle.classList.add('menu-toggle');
document.querySelector('.navbar .container').appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
  themeToggle.textContent = savedTheme === 'dark-mode' ? '🌞' : '🌙';
}
themeToggle.addEventListener('click', () => {
  const isDarkMode = body.classList.contains('dark-mode');
  if (isDarkMode) {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light-mode');
    themeToggle.textContent = '🌙';
  } else {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark-mode');
    themeToggle.textContent = '🌞';
  }
});

const fetchDefinitionButton = document.getElementById('fetch-definition');
const wordInput = document.getElementById('word-input');
const definitionResult = document.getElementById('definition-result');

fetchDefinitionButton.addEventListener('click', async () => {
  const word = wordInput.value.trim();
  if (!word) {
    definitionResult.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error('Word not found');
    }
    const data = await response.json();

    const meanings = data[0].meanings.map(
      (meaning) => `
      <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
      <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
      `
    ).join('');
    definitionResult.innerHTML = `
      <h3>Word: ${data[0].word}</h3>
      ${meanings}
    `;
  } catch (error) {
    definitionResult.innerHTML = "<p>Sorry, the word was not found. Please try another one.</p>";
    console.error('Error fetching word definition:', error);
  }
});

