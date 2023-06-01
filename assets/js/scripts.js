// An object to store our flash cards arrays, organized by topic
const flashCardsSeries = {
    physics: [
        { keyword: 'Force', definition: 'A push or pull upon an object resulting from the object\'s interaction with another object.' },
        { keyword: 'Energy', definition: 'The capacity to do work.' },
        // add more Physics flashcards here...
    ],
    biology: [
        { keyword: 'Cell', definition: 'The basic structural, functional, and biological unit of all known organisms.' },
        { keyword: 'DNA', definition: 'A molecule composed of two chains that coil around each other to form a double helix.' },
        // add more Biology flashcards here...
    ],
    chemistry: [
        { keyword: 'Atom', definition: 'The smallest unit of a chemical element that retains its chemical properties.' },
        { keyword: 'Molecule', definition: 'A group of atoms bonded together.' },
        // add more Chemistry flashcards here...
    ],
    // add more topics here...
};

let currentTopic = 'physics'; // start with Physics flashcards

// Get HTML elements
const flashCardsContainer = document.getElementById('flashCardsContainer');
const checkAnswersButton = document.getElementById('checkAnswers');
const timerElement = document.getElementById('timer');

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
        keywordElement.innerText = card.keyword;
        keywordElement.dataset.id = index;

        const definitions = flashCardsSeries[topic].map(flashCard => flashCard.definition);
        shuffle(definitions);

        const selectElement = document.createElement('select');
        definitions.forEach(definition => {
            const optionElement = document.createElement('option');
            optionElement.value = definition;
            optionElement.innerText = definition;
            selectElement.appendChild(optionElement);
        });

        cardElement.appendChild(keywordElement);
        cardElement.appendChild(selectElement);
        flashCardsContainer.appendChild(cardElement);
    });

    startTimer(); // Start the timer each time we create new flash cards
}

// Variable to hold the timer
let timer;

// Function to start the timer
function startTimer() {
    // Reset timer if it is already running
    if (timer) {
        clearTimeout(timer);
    }

    // Update timer display
    timerElement.innerText = '15';

    // Start new timer
    timer = setInterval(() => {
        timerElement.innerText = Number(timerElement.innerText) - 1;

        if (timerElement.innerText === '0') {
            // Automatically check answers when time is up
            checkAnswers();
            alert('Time is up! Let\'s see how you did.');

            // Move on to the next set of questions
            switchTopic();
            createFlashCards(currentTopic);
        }
    }, 1000);
}

// Function to switch topic
function switchTopic() {
    switch (currentTopic) {
        case 'physics':
            currentTopic = 'biology';
            break;
        case 'biology':
            currentTopic = 'chemistry';
            break;
        case 'chemistry':
            currentTopic = 'physics'; // loop back to Physics after Chemistry
            break;
    }
}

// Function to check answers
function checkAnswers() {
    const flashCardsElements = document.querySelectorAll('.flashCard');
    let correctAnswers = 0;
