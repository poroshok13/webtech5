const MIN_VAL = 1;
const MAX_VAL = 100;
const INITIAL_LIVES = 3;

let currentNumber = getRandomInteger(MIN_VAL, MAX_VAL);
let lives = INITIAL_LIVES;
let streak = 0;
let bestStreak = 0;
let isGameOver = false;

const currentNumberEl = document.getElementById('current-number');
const livesEl = document.getElementById('lives');
const streakEl = document.getElementById('streak');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const btnHigher = document.getElementById('btn-higher');
const btnLower = document.getElementById('btn-lower');
const btnRestart = document.getElementById('btn-restart');

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateDisplay() {
  currentNumberEl.textContent = currentNumber;
  livesEl.textContent = lives;
  streakEl.textContent = streak;
  bestEl.textContent = bestStreak;
}

function handleGuess(guess) {
  if (isGameOver || lives === 0) {
    messageEl.textContent = 'Game is finished. Click Restart to play again.';
    messageEl.className = 'message msg-error';
    return;
  }

  const nextNumber = getRandomInteger(MIN_VAL, MAX_VAL);
  const isCorrect = (nextNumber === currentNumber) || (guess === 'higher' && nextNumber > currentNumber) || (guess === 'lower' && nextNumber < currentNumber);

  if (isCorrect) {
    streak += 1;
    if (streak > bestStreak) {
      bestStreak = streak;
    }
    messageEl.textContent = `Correct! Next was ${nextNumber}. Streak: ${streak}.`;
    messageEl.className = 'message msg-win';
  } else if (!isCorrect && lives > 1) {
    lives -= 1;
    streak = 0;
    messageEl.textContent = `Wrong! Next was ${nextNumber}. Lives left: ${lives}.`;
    messageEl.className = 'message msg-loss';
  } else if (!isCorrect && lives === 1) {
    lives = 0;
    streak = 0;
    isGameOver = true;
    messageEl.textContent = `Game Over! Next was ${nextNumber}. Final score: ${bestStreak}.`;
    messageEl.className = 'message msg-loss';
    btnHigher.disabled = true;
    btnLower.disabled = true;
    btnRestart.disabled = false;
  }

  currentNumber = nextNumber;
  updateDisplay();
}

function restartGame() {
  currentNumber = getRandomInteger(MIN_VAL, MAX_VAL);
  lives = INITIAL_LIVES;
  streak = 0;
  isGameOver = false;

  btnHigher.disabled = false;
  btnLower.disabled = false;
  btnRestart.disabled = true;

  messageEl.textContent = 'Guess if next number (1-100) is higher or lower';
  messageEl.className = 'message';
  updateDisplay();
}

btnHigher.addEventListener('click', () => handleGuess('higher'));
btnLower.addEventListener('click', () => handleGuess('lower'));
btnRestart.addEventListener('click', restartGame);

updateDisplay();
