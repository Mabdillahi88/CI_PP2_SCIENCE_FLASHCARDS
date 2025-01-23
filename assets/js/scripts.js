/*jshint esversion: 6 */

// Flashcard series data for different topics
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
let currentSet = 0; // Current topic index
const totalSets = Object.keys(flashCardsSeries).length; // Total number of topics

let hintsRemaining = 2; // Remaining hints per topic
let hintUsed = false; // Whether a hint has been used

let timerInterval;
const timerDuration = 15; // Total timer duration in seconds
let remainingTime = timerDuration; // Remaining time for the timer

// Tally Chart variables to track correct/incorrect answers
let tallyCorrect = 0;
let tallyIncorrect = 0;

// DOM element references
const flashCardsContainer = document.getElementById('flashCardsContainer');
const checkAnswersButton = document.getElementById('checkAnswers');
const progressIndicator = document.getElementById('progressIndicator');
const hintButton = document.getElementById('hintButton');
const tallyChart = document.getElementById('tallyChart');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

// Timer DOM elements
const timerText = document.getElementById('timerText');
const foregroundCircle = document.querySelector('.foreground-circle');

// Set up the timer circle dimensions
const radius = 45; // Matches the radius in the SVG circle
const circumference = 2 * Math.PI * radius; // Calculate circle's circumference
foregroundCircle.style.strokeDasharray = `${circumference} ${circumference}`; // Define stroke length
foregroundCircle.style.strokeDashoffset = `${circumference}`; // Initially hide the stroke

// Reset the timer to its initial state
function resetTimer() {
  clearInterval(timerInterval); // Stop any ongoing timer
  remainingTime = timerDuration; // Reset time
  foregroundCircle.style.strokeDashoffset = `${circumference}`; // Reset circle animation
  timerText.textContent = timerDuration; // Reset displayed time
}

// Start the countdown timer
function startTimer() {
  resetTimer(); // Ensure the timer is reset
  timerInterval = setInterval(() => {
    remainingTime--;
    const progress = remainingTime / timerDuration;
    const offset = circumference * (1 - progress);

    // Update circle animation and timer display
    foregroundCircle.style.strokeDashoffset = offset;
    timerText.textContent = remainingTime;

    // If time runs out, reveal answers and move to the next topic
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      revealCorrectAnswers();
      setTimeout(() => nextTopic(), 3000);
    }
  }, 1000);
}

// Dynamically create flashcards for the selected topic
function createFlashCards(topic) {
  flashCardsContainer.innerHTML = ''; // Clear previous flashcards

  flashCardsSeries[topic].forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashCard');

    // Display the keyword on the card
    const keywordElement = document.createElement('div');
    keywordElement.classList.add('keyword');
    keywordElement.innerText = `Keyword: ${card.keyword}`;
    keywordElement.dataset.id = index;

    // Populate dropdown with shuffled definitions
    const definitions = flashCardsSeries[topic].map((flashCard) => flashCard.definition);
    shuffle(definitions);

    const selectElement = document.createElement('select');
    definitions.forEach((definition) => {
      const optionElement = document.createElement('option');
      optionElement.value = definition;
      optionElement.innerText = definition;
      selectElement.appendChild(optionElement);
    });

    // Append elements to the card
    cardElement.appendChild(keywordElement);
    cardElement.appendChild(selectElement);
    flashCardsContainer.appendChild(cardElement);
  });

  updateProgressIndicator(); // Update progress bar
  updateTallyChart(); // Update score tally
  resetTimer(); // Reset the timer
  startTimer(); // Start the timer
  hintUsed = false; // Reset hint usage
  updateHintButton(); // Update hint button state
}

// Shuffle array for randomized options
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Display the progress indicator
function updateProgressIndicator() {
  progressIndicator.innerText = `Set ${currentSet + 1} of ${totalSets}`;
}

// Use a hint and automatically select the correct answer
function useHint() {
  if (hintsRemaining > 0 && !hintUsed) {
    hintUsed = true;
    hintsRemaining--;
    updateHintButton();

    // Automatically fill the correct answer for the first card
    const currentCardElement = flashCardsContainer.firstChild;
    const currentCardIndex = currentCardElement.querySelector('.keyword').dataset.id;
    const correctDefinition = flashCardsSeries[currentTopic][currentCardIndex].definition;

    currentCardElement.querySelector('select').value = correctDefinition;
    currentCardElement.classList.add('hint-highlight'); // Highlight the hint
  }
}

// Update hint button text and state
function updateHintButton() {
  hintButton.innerText = `Hint (${hintsRemaining} left)`;
  hintButton.disabled = hintsRemaining === 0; // Disable if no hints remain
}

// Reveal correct answers and tally scores
function revealCorrectAnswers() {
  const flashCardsElements = document.querySelectorAll('.flashCard');
  let correctAnswers = 0;

  flashCardsElements.forEach((cardElement) => {
    const keywordElement = cardElement.querySelector('.keyword');
    const definitionSelect = cardElement.querySelector('select');
    const correctDefinition = flashCardsSeries[currentTopic][keywordElement.dataset.id].definition;

    if (definitionSelect.value === correctDefinition) {
      correctAnswers++;
      cardElement.classList.add('correct');
    } else {
      cardElement.classList.add('incorrect');
    }
  });

  // Update the tally
  tallyCorrect += correctAnswers;
  tallyIncorrect += flashCardsElements.length - correctAnswers;
  updateTallyChart();
}

// Update the tally chart display
function updateTallyChart() {
  const tallyChartHTML = `
    <table>
      <tr>
        <th>Correct</th>
        <th>Incorrect</th>
      </tr>
      <tr>
        <td>${tallyCorrect}</td>
        <td>${tallyIncorrect}</td>
      </tr>
    </table>
  `;
  tallyChart.innerHTML = tallyChartHTML;
}

// Move to the next topic
function nextTopic() {
  currentSet = (currentSet + 1) % totalSets;
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2; // Reset hints
  createFlashCards(currentTopic);
}

// Event Listeners for buttons
checkAnswersButton.addEventListener('click', revealCorrectAnswers);
hintButton.addEventListener('click', useHint);
nextButton.addEventListener('click', nextTopic);
prevButton.addEventListener('click', () => {
  currentSet = (currentSet - 1 + totalSets) % totalSets;
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2;
  createFlashCards(currentTopic);
});

// Initialize with the default topic
createFlashCards(currentTopic);
