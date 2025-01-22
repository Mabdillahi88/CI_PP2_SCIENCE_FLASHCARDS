/*jshint esversion: 6 */

// Flashcard series data
const flashCardsSeries = {
  physics: [
    { keyword: 'Force', definition: 'A push or pull upon an object resulting from the object\'s interaction with another object.' },
    { keyword: 'Energy', definition: 'The capacity to do work.' },
    { keyword: 'Renewables', definition: 'Sustainable energy sources.' },
    { keyword: 'Fossil Fuels', definition: 'Ancient organic remains as fuel.' },
    { keyword: 'Efficiency', definition: 'Maximizing output, minimizing waste.' },
  ],
  biology: [
    { keyword: 'Cell', definition: 'The basic structural, functional, and biological unit of all known organisms.' },
    { keyword: 'DNA', definition: 'A molecule composed of two chains that coil around each other to form a double helix.' },
    { keyword: 'Mitosis', definition: 'Cell division.' },
    { keyword: 'Photosynthesis', definition: 'Light to energy.' },
  ],
  chemistry: [
    { keyword: 'Atom', definition: 'The smallest unit of a chemical element that retains its chemical properties.' },
    { keyword: 'Molecule', definition: 'A group of atoms bonded together.' },
    { keyword: 'Acid', definition: 'Sour-tasting compound.' },
    { keyword: 'Base', definition: 'Alkaline compound.' },
  ],
};

// Global variables
let currentTopic = 'physics'; // Default topic
let currentSet = 0; // Current set index
const totalSets = Object.keys(flashCardsSeries).length;

let hintsRemaining = 2; // Hints per topic
let hintUsed = false; // Track if hint is used

let timerInterval;
const timerDuration = 15; // Timer duration in seconds
let remainingTime = timerDuration;

// DOM Elements
const flashCardsContainer = document.getElementById('flashCardsContainer');
const checkAnswersButton = document.getElementById('checkAnswers');
const progressIndicator = document.getElementById('progressIndicator');
const hintButton = document.getElementById('hintButton');
const tallyChart = document.getElementById('tallyChart');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

// Timer DOM Elements
const timerText = document.getElementById('timerText');
const foregroundCircle = document.querySelector('.foreground-circle');

// Set the circumference of the timer circle
const radius = 45; // Matches the `r` in the SVG circle
const circumference = 2 * Math.PI * radius;
foregroundCircle.style.strokeDasharray = `${circumference} ${circumference}`;
foregroundCircle.style.strokeDashoffset = `${circumference}`;

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  remainingTime = timerDuration;
  foregroundCircle.style.strokeDashoffset = `${circumference}`; // Reset circle
  timerText.textContent = timerDuration; // Reset timer text
}

// Start Timer
function startTimer() {
  resetTimer();
  timerInterval = setInterval(() => {
    remainingTime--;
    const progress = remainingTime / timerDuration;
    const offset = circumference * (1 - progress);

    // Update circle and text
    foregroundCircle.style.strokeDashoffset = offset;
    timerText.textContent = remainingTime;

    // Time is up
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      revealCorrectAnswers();
      setTimeout(() => nextTopic(), 3000);
    }
  }, 1000);
}

// Create flashcards for a topic
function createFlashCards(topic) {
  flashCardsContainer.innerHTML = '';

  flashCardsSeries[topic].forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashCard');

    const keywordElement = document.createElement('div');
    keywordElement.classList.add('keyword');
    keywordElement.innerText = `Keyword: ${card.keyword}`;
    keywordElement.dataset.id = index;

    const definitions = flashCardsSeries[topic].map((flashCard) => flashCard.definition);
    shuffle(definitions);

    const selectElement = document.createElement('select');
    definitions.forEach((definition) => {
      const optionElement = document.createElement('option');
      optionElement.value = definition;
      optionElement.innerText = definition;
      selectElement.appendChild(optionElement);
    });

    cardElement.appendChild(keywordElement);
    cardElement.appendChild(selectElement);
    flashCardsContainer.appendChild(cardElement);
  });

  highlightActiveFlashcard(0); // Highlight the first flashcard initially
  updateProgressIndicator();
  resetTimer();
  startTimer();
  hintUsed = false;
  updateHintButton();
}

// Shuffle array utility function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Update progress indicator
function updateProgressIndicator() {
  progressIndicator.innerText = `Set ${currentSet + 1} of ${totalSets}`;
}

// Use a hint
function useHint() {
  if (hintsRemaining > 0 && !hintUsed) {
    hintUsed = true;
    hintsRemaining--;
    updateHintButton();

    const currentCardElement = flashCardsContainer.firstChild;
    const currentCardIndex = currentCardElement.querySelector('.keyword').dataset.id;
    const correctDefinition = flashCardsSeries[currentTopic][currentCardIndex].definition;

    currentCardElement.querySelector('select').value = correctDefinition;
    currentCardElement.classList.add('hint-highlight');
  }
}

// Update hint button text
function updateHintButton() {
  hintButton.innerText = `Hint (${hintsRemaining} left)`;
  hintButton.disabled = hintsRemaining === 0;
}

// Reveal correct answers
function revealCorrectAnswers() {
  const flashCardsElements = document.querySelectorAll('.flashCard');

  flashCardsElements.forEach((cardElement) => {
    const keywordElement = cardElement.querySelector('.keyword');
    const definitionSelect = cardElement.querySelector('select');
    const correctDefinition = flashCardsSeries[currentTopic][keywordElement.dataset.id].definition;

    definitionSelect.value = correctDefinition;
    cardElement.classList.add('correct');
  });
}

// Switch to the next topic
function nextTopic() {
  currentSet = (currentSet + 1) % totalSets;
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2;
  createFlashCards(currentTopic);
}

// Switch to the previous topic
function prevTopic() {
  currentSet = (currentSet - 1 + totalSets) % totalSets;
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2;
  createFlashCards(currentTopic);
}

// Highlight the active flashcard
function highlightActiveFlashcard(cardIndex) {
  const flashCards = document.querySelectorAll('.flashCard');
  flashCards.forEach((card, index) => {
    card.classList.toggle('active', index === cardIndex);
  });
}

// Check answers
function checkAnswers() {
  const flashCardsElements = document.querySelectorAll('.flashCard');
  let correctAnswers = 0;

  flashCardsElements.forEach((cardElement) => {
    const definitionSelect = cardElement.querySelector('select');
    const keywordElement = cardElement.querySelector('.keyword');
    const correctDefinition = flashCardsSeries[currentTopic][keywordElement.dataset.id].definition;

    if (definitionSelect.value === correctDefinition) {
      correctAnswers++;
      cardElement.classList.add('correct');
    } else {
      cardElement.classList.add('incorrect');
    }
  });

  alert(`You got ${correctAnswers} out of ${flashCardsSeries[currentTopic].length} correct!`);
}

// Event Listeners
checkAnswersButton.addEventListener('click', checkAnswers);
hintButton.addEventListener('click', useHint);
nextButton.addEventListener('click', nextTopic);
prevButton.addEventListener('click', prevTopic);

// Initialize
createFlashCards(currentTopic);
