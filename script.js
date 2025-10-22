
// Game state
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

// Word list
const WORDS = [
    'REACT', 'ARRAY', 'CLASS', 'FETCH', 'ASYNC',
    'STACK', 'QUEUE', 'THROW', 'CONST', 'MOUSE',
    'WHALE', 'PIANO', 'HORSE', 'APPLE', 'BEACH',
    'STORM', 'LIGHT', 'PHONE', 'PLANT', 'MUSIC'
];

// Select random word
const targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log('Answer (for testing):', targetWord);

// Keyboard layout
const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

// Initialize the game board
function createBoard() {
    const board = document.getElementById('board');
    
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}-${j}`;
            row.appendChild(tile);
        }
        
        board.appendChild(row);
    }
}

// Create keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    
    KEYBOARD_ROWS.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = key;
            button.setAttribute('data-key', key);
            
            if (key === 'ENTER' || key === '⌫') {
                button.classList.add('wide');
            }
            
            button.addEventListener('click', () => handleKeyPress(key));
            keyboardRow.appendChild(button);
        });
        
        keyboard.appendChild(keyboardRow);
    });
}

// Handle key press
function handleKeyPress(key) {
    if (gameOver) return;
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫') {
        deleteLetter();
    } else if (currentTile < WORD_LENGTH) {
        addLetter(key);
    }
}

// Add letter to tile
function addLetter(letter) {
    if (currentTile < WORD_LENGTH) {
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        tile.textContent = letter;
        tile.classList.add('filled');
        currentTile++;
    }
}

// Delete letter from tile
function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

// Submit guess
function submitGuess() {
    if (currentTile < WORD_LENGTH) {
        showMessage('Not enough letters');
        return;
    }
    
    // Get the current guess
    let guess = '';
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.getElementById(`tile-${currentRow}-${i}`);
        guess += tile.textContent;
    }
    
    // Check if it's a valid word
    if (!WORDS.includes(guess)) {
        showMessage('Not in word list');
        return;
    }
    
    // Check each letter
    checkGuess(guess);
    
    // Move to next row or end game
    currentRow++;
    currentTile = 0;
    
    if (guess === targetWord) {
        gameOver = true;
        showMessage('Congratulations! 🎉');
    } else if (currentRow >= MAX_GUESSES) {
        gameOver = true;
        showMessage(`Game Over! The word was ${targetWord}`);
    }
}

// Check guess against target word
function checkGuess(guess) {
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    const letterCount = {};
    
    // Count letters in target word
    targetLetters.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });
    
    // First pass: mark correct letters (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            updateTile(i, 'correct');
            updateKey(guessLetters[i], 'correct');
            letterCount[guessLetters[i]]--;
        }
    }
    
    // Second pass: mark present/absent letters (yellow/gray)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] !== targetLetters[i]) {
            if (targetLetters.includes(guessLetters[i]) && letterCount[guessLetters[i]] > 0) {
                updateTile(i, 'present');
                updateKey(guessLetters[i], 'present');
                letterCount[guessLetters[i]]--;
            } else {
                updateTile(i, 'absent');
                updateKey(guessLetters[i], 'absent');
            }
        }
    }
}

// Update tile color
function updateTile(index, status) {
    const tile = document.getElementById(`tile-${currentRow}-${index}`);
    setTimeout(() => {
        tile.classList.add(status);
    }, index * 300);
}

// Update keyboard key color
function updateKey(letter, status) {
    const key = document.querySelector(`[data-key="${letter}"]`);
    if (key) {
        const currentStatus = key.className;
        // Don't downgrade from correct to present/absent
        if (currentStatus.includes('correct')) return;
        if (currentStatus.includes('present') && status === 'absent') return;
        
        key.classList.add(status);
    }
}

// Show message
function showMessage(text) {
    const message = document.getElementById('message');
    message.textContent = text;
    setTimeout(() => {
        message.textContent = '';
    }, 2000);
}

// Listen to physical keyboard
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
        handleKeyPress('⌫');
    } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
    }
});

// Initialize the game
function init() {
    createBoard();
    createKeyboard();
}

// Start the game when page loads
init();
