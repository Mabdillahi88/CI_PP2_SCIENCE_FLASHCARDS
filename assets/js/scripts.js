// An object to store our flash cards arrays, organized by topic
const flashCardsSeries = {
  physics: [
    { keyword: 'Force', definition: 'A push or pull upon an object resulting from the object\'s interaction with another object.' },
    { keyword: 'Energy', definition: 'The capacity to do work.' },
    { keyword: 'Energy', definition: 'Capacity for work.' },
    { keyword: 'Renewables', definition: 'Sustainable energy sources.' },
    { keyword: 'Fossil Fuels', definition: 'Ancient organic remains as fuel.' },
    { keyword: 'Efficiency', definition: 'Maximizing output, minimizing waste.' },
    // add more Physics flashcards here...
  ],
  biology: [
    { keyword: 'Cell', definition: 'The basic structural, functional, and biological unit of all known organisms.' },
    { keyword: 'DNA', definition: 'A molecule composed of two chains that coil around each other to form a double helix.' },
    { keyword: 'DNA', definition: 'Genetic material.' },
    { keyword: 'Cell', definition: 'Basic unit of life.' },
    { keyword: 'Mitosis', definition: 'Cell division.' },
    { keyword: 'Photosynthesis', definition: 'Light to energy.' },
    // add more Biology flashcards here...
  ],
  chemistry: [
    { keyword: 'Atom', definition: 'The smallest unit of a chemical element that retains its chemical properties.' },
    { keyword: 'Molecule', definition: 'A group of atoms bonded together.' },
    { keyword: 'Atom', definition: 'Basic unit of matter.' },
    { keyword: 'Molecule', definition: 'Chemical structure.' },
    { keyword: 'Acid', definition: 'Sour-tasting compound.' },
    { keyword: 'Base', definition: 'Alkaline compound.' },
    // add more Chemistry flashcards here...
  ],
  // add more topics here...
};

let currentTopic = 'physics'; // start with Physics flashcards
let currentSet = 0; // current set of questions
const totalSets = Object.keys(flashCardsSeries).length; // total number of question sets

let hintsRemaining = 2; // maximum number of hints allowed
let hintUsed = false; // flag to track if hint has been used for current question

let timerInterval; // variable to hold the timer interval
let timerDuration = 15; // duration in seconds for each set of questions

// Get HTML elements
const flashCardsContainer = document.getElementById('flashCardsContainer');
const checkAnswersButton = document.getElementById('checkAnswers');
const progressIndicator = document.getElementById('progressIndicator');
const hintButton = document.getElementById('hintButton');
const timerBar = document.getElementById('timerBar');
const tallyChart = document.getElementById('tallyChart');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

let tallyCorrect = 0; // counter for correct answers
let tallyIncorrect = 0; // counter for incorrect answers

// Function to shuffle array - we use this to shuffle definitions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to create flash cards
function createFlashCards(topic) {
  flashCardsContainer.innerHTML = '';

  flashCardsSeries[topic].forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashCard');

    const keywordElement = document.createElement('div');
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

  updateProgressIndicator();
  resetTimer();
  startTimer();
  hintUsed = false;
  updateHintButton();
}

// Function to update progress indicator
function updateProgressIndicator() {
  progressIndicator.innerText = `Set ${currentSet + 1} of ${totalSets}`;
}

// Function to reset timer
function resetTimer() {
  clearInterval(timerInterval);
  timerBar.style.width = '100%';
}

// Function to start the timer
function startTimer() {
  let remainingSeconds = timerDuration;

  timerInterval = setInterval(() => {
    remainingSeconds--;
    const percentage = (remainingSeconds / timerDuration) * 100;
    timerBar.style.width = `${percentage}%`;

    if (remainingSeconds === 0) {
      clearInterval(timerInterval);
      revealCorrectAnswers();
      setTimeout(() => {
        nextTopic();
      }, 3000);
    }
  }, 1000);
}

// Function to reveal correct answers
function revealCorrectAnswers() {
  const flashCardsElements = document.querySelectorAll('.flashCard');

  flashCardsElements.forEach((cardElement) => {
    const keywordElement = cardElement.querySelector('div');
    const definitionSelect = cardElement.querySelector('select');

    const correctDefinition = flashCardsSeries[currentTopic][keywordElement.dataset.id].definition;
    keywordElement.innerText = `${cardElement.querySelector('div').innerText} (${correctDefinition})`; // Display the keyword with the correct definition as a hint
    definitionSelect.disabled = true;
    definitionSelect.value = correctDefinition;
  });
}

// Function to switch to the next topic
function nextTopic() {
  currentSet++;
  if (currentSet === totalSets) {
    currentSet = 0; // loop back to the first set after completing all sets
  }
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2; // reset hints for each set of questions

  createFlashCards(currentTopic);
}

// Function to switch to the previous topic
function prevTopic() {
  currentSet--;
  if (currentSet < 0) {
    currentSet = totalSets - 1; // loop back to the last set if at the first set
  }
  currentTopic = Object.keys(flashCardsSeries)[currentSet];
  hintsRemaining = 2; // reset hints for each set of questions

  createFlashCards(currentTopic);
}

// Function to use hint
function useHint() {
  if (hintsRemaining > 0 && !hintUsed) {
    hintUsed = true;
    hintsRemaining--;
    updateHintButton();

    const flashCardsElements = document.querySelectorAll('.flashCard');
    const currentCardElement = flashCardsElements[currentSet];
    const currentCardIndex = currentCardElement.querySelector('div').dataset.id;
    const correctDefinition = flashCardsSeries[currentTopic][currentCardIndex].definition;
    currentCardElement.querySelector('div').innerText = `${currentCardElement.querySelector('div').innerText} (${correctDefinition})`; // Display the keyword with the correct definition as a hint
  }
}

// Function to update hint button text
function updateHintButton() {
  hintButton.innerText = `Hint (${hintsRemaining} left)`;
  hintButton.disabled = hintsRemaining === 0;
}

// Function to check answers
function checkAnswers() {
  const flashCardsElements = document.querySelectorAll('.flashCard');
  let correctAnswers = 0;

  flashCardsElements.forEach((cardElement) => {
    const definitionSelect = cardElement.querySelector('select');
    const correctDefinition = flashCardsSeries[currentTopic][cardElement.querySelector('div').dataset.id].definition;

    if (definitionSelect.value === correctDefinition) {
      correctAnswers++;
      cardElement.classList.add('correct');
    } else {
      cardElement.classList.add('incorrect');
    }
  });

  tallyCorrect += correctAnswers;
  tallyIncorrect += flashCardsSeries[currentTopic].length - correctAnswers;

  alert(`You got ${correctAnswers} out of ${flashCardsSeries[currentTopic].length} correct!`);

  if (correctAnswers === flashCardsSeries[currentTopic].length) {
    nextTopic();
  }
}

// Function to reset the tally chart
function resetTallyChart() {
  tallyCorrect = 0;
  tallyIncorrect = 0;
  tallyChart.innerHTML = '';
}

// Function to update the tally chart
function updateTallyChart() {
  tallyChart.innerHTML = `
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
}

// Event listeners
checkAnswersButton.addEventListener('click', () => {
  checkAnswers();
  resetTimer();
  updateTallyChart();
});

hintButton.addEventListener('click', () => {
  useHint();
});

nextButton.addEventListener('click', () => {
  nextTopic();
});

prevButton.addEventListener('click', () => {
  prevTopic();
});

// Start with creating flash cards for the first topic
createFlashCards(currentTopic);
resetTallyChart();
updateTallyChart();
