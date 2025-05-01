// Available colors
const COLORS = [
    '#e81416', // Red
    '#79c314', // Green
    '#487de7', // Blue
    '#faeb36', // Yellow
    '#FD3DB5', // Magenta
    '#70369d', // Violet
    '#ffa500'  // Orange
];

// Game state
let difficulty = 5;
let selectedColors = [];
let targetSequence = [];
let attempts = 0;
let gameWon = false;

// DOM Elements
const difficultyInput = document.getElementById('difficultyInput');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const colorOptions = document.getElementById('colorOptions');
const selectedColorsContainer = document.getElementById('selectedColors');
const submitButton = document.getElementById('submitButton');
const feedback = document.getElementById('feedback');
const attemptsCounter = document.getElementById('attemptsCounter');
const historyContainer = document.getElementById('historyContainer');
const attemptsHistory = document.getElementById('attemptsHistory');
const winMessage = document.getElementById('winMessage');
const resetButton = document.getElementById('resetButton');

// Start game when button is clicked
startButton.addEventListener('click', startGame);

// Initialize a new game
function startGame() {
    // Get difficulty level
    difficulty = parseInt(difficultyInput.value);

    // Validate difficulty
    if (isNaN(difficulty) || difficulty < 3 || difficulty > 7) {
        alert('Please enter a number between 3 and 7');
        return;
    }

    // Reset game state
    selectedColors = [];
    attempts = 0;
    gameWon = false;

    // Show game container
    gameContainer.style.display = 'block';

    // Generate target sequence
    const shuffledColors = [...COLORS.slice(0, difficulty)];
    shuffleArray(shuffledColors);
    targetSequence = shuffledColors;

    // Render color options
    renderColorOptions();

    // Render empty slots for selected colors
    renderSelectedColors();

    // Reset UI elements
    feedback.textContent = '';
    attemptsCounter.textContent = 'Attempts: 0';
    attemptsHistory.innerHTML = '';
    historyContainer.style.display = 'none';
    winMessage.style.display = 'none';
    resetButton.style.display = 'none';
    submitButton.disabled = true;
}

// Render the color options
function renderColorOptions() {
    colorOptions.innerHTML = '';

    for (let i = 0; i < difficulty; i++) {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option';
        colorElement.style.backgroundColor = COLORS[i];
        colorElement.dataset.color = COLORS[i];

        colorElement.addEventListener('click', () => {
            if (gameWon) return;

            if (selectedColors.length < difficulty) {
                selectedColors.push(COLORS[i]);
                renderSelectedColors();

                // Enable submit button when all colors are selected
                if (selectedColors.length === difficulty) {
                    submitButton.disabled = false;
                }
            }
        });

        colorOptions.appendChild(colorElement);
    }
}

// Render the selected colors or empty slots
function renderSelectedColors() {
    selectedColorsContainer.innerHTML = '';

    for (let i = 0; i < difficulty; i++) {
        const colorElement = document.createElement('div');

        if (i < selectedColors.length) {
            colorElement.className = 'selected-color';
            colorElement.style.backgroundColor = selectedColors[i];

            // Add click event to remove this color
            colorElement.addEventListener('click', () => {
                if (gameWon) return;

                selectedColors.splice(i, 1);
                renderSelectedColors();
                submitButton.disabled = true;
            });
        } else {
            colorElement.className = 'empty-slot';
        }

        selectedColorsContainer.appendChild(colorElement);
    }
}

// Submit button click handler
submitButton.addEventListener('click', () => {
    if (selectedColors.length !== difficulty) return;

    attempts++;
    attemptsCounter.textContent = `Attempts: ${attempts}`;

    // Count correct positions
    let correctPositions = 0;
    for (let i = 0; i < difficulty; i++) {
        if (selectedColors[i] === targetSequence[i]) {
            correctPositions++;
        }
    }

    // Check if won
    if (correctPositions === difficulty) {
        gameWon = true;
        feedback.textContent = `All ${difficulty} colors are in the correct position!`;
        winMessage.style.display = 'block';
        resetButton.style.display = 'inline-block';
        submitButton.disabled = true;
    } else {
        feedback.textContent = `${correctPositions} out of ${difficulty} colors are in the correct position.`;
    }

    // Add to history
    historyContainer.style.display = 'block';
    const attemptRow = document.createElement('div');
    attemptRow.className = 'attempt-row';

    const attemptColors = document.createElement('div');
    attemptColors.className = 'attempt-colors';

    for (let i = 0; i < difficulty; i++) {
        const colorElement = document.createElement('div');
        colorElement.className = 'attempt-color';
        colorElement.style.backgroundColor = selectedColors[i];
        attemptColors.appendChild(colorElement);
    }

    const attemptFeedback = document.createElement('div');
    attemptFeedback.className = 'attempt-feedback';
    attemptFeedback.textContent = `${correctPositions} correct`;

    attemptRow.appendChild(attemptColors);
    attemptRow.appendChild(attemptFeedback);
    attemptsHistory.prepend(attemptRow);

    // Reset selection for next attempt if not won
    if (!gameWon) {
        selectedColors = [];
        renderSelectedColors();
        submitButton.disabled = true;
    }
});

// Reset button click handler
resetButton.addEventListener('click', startGame);

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
