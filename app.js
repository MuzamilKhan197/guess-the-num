console.info("🎮 Guess My Number Started");

// DOM ELEMENTS
const body = document.body;
const modal = document.getElementById("difficulty-modal");
const againBtn = document.getElementById("again-btn");
const checkBtn = document.getElementById("check-btn");
const guessInput = document.getElementById("user-guess");
const numberBox = document.getElementById("number-box");
const message = document.getElementById("msg-text");
const chancesText = document.getElementById("chances-val");
const highscoreText = document.getElementById("highscore-val");
const rangeText = document.getElementById("range-text");
const difficultyText = document.getElementById("difficulty-text");

// GAME CONFIGURATION
const DIFFICULTY = {
    easy: { range: 15, chances: 5 },
    normal: { range: 30, chances: 8 },
    hard: { range: 50, chances: 10 }
};

// GAME STATE
const game = {
    difficulty: "normal",
    range: 30,
    secretNumber: 0,
    chances: 8,
    maxChances: 8,
    highscore: Number(localStorage.getItem("guessHighscore")) || 0,
    active: false
};

// INITIAL UI
highscoreText.textContent = game.highscore;
checkBtn.disabled = true;
guessInput.disabled = true;

// RANDOM NUMBER
function randomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

// MESSAGE
function setMessage(text, className = "") {
    message.textContent = text;
    message.className = "";
    if (className) {
        message.classList.add(className);
    }
}

// BODY STATE
function setBodyState(state = "") {
    body.classList.remove("correct", "game-over");
    if (state) {
        body.classList.add(state);
    }
}

// SECRET NUMBER
function revealSecret() {
    numberBox.textContent = game.secretNumber;
    numberBox.classList.remove("pop");
    void numberBox.offsetWidth;
    numberBox.classList.add("pop");
}

function hideSecret() {
    numberBox.textContent = "?";
}

// INPUT
function clearInput() {
    guessInput.value = "";
    guessInput.focus();
}

// BUTTONS
function enableGame() {
    checkBtn.disabled = false;
    guessInput.disabled = false;
}

function disableGame() {
    checkBtn.disabled = true;
    guessInput.disabled = true;
}

// UPDATE UI
function updateUI() {
    chancesText.textContent = game.chances;
    highscoreText.textContent = game.highscore;
    rangeText.textContent = `1 - ${game.range}`;
    difficultyText.textContent = game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
}

// SAVE HIGHSCORE
function saveHighscore() {
    localStorage.setItem("guessHighscore", game.highscore);
}

// INPUT VALIDATION
function validateGuess(value) {
    if (value === "") {
        setMessage("⛔ Enter a number!", "warning");
        return false;
    }
    const guess = Number(value);
    if (guess < 1 || guess > game.range) {
        setMessage(`❌ Enter a number between 1 and ${game.range}`, "error");
        return false;
    }
    return true;
}

// DEBUG
function debugGame() {
    console.table({
        Difficulty: game.difficulty,
        Range: game.range,
        Secret: game.secretNumber,
        Chances: game.chances,
        Highscore: game.highscore,
        Active: game.active
    });
}


// START GAME
function startGame(difficulty) {
    console.group("🎮 New Game");
    game.difficulty = difficulty;
    game.range = DIFFICULTY[difficulty].range;
    game.maxChances = DIFFICULTY[difficulty].chances;
    game.chances = game.maxChances;
    game.secretNumber = randomNumber(game.range);
    game.active = true;
    modal.style.display = "none";
    enableGame();
    resetBoard();
    updateUI();
    debugGame();
    console.groupEnd();
}

// RESET BOARD
function resetBoard() {
    hideSecret();
    clearInput();
    setBodyState();
    setMessage("🎯 Start Guessing...");
    updateUI();
}

// RESET GAME
function resetGame() {
    console.info("🔄 Restarting Game");
    game.secretNumber = randomNumber(game.range);
    game.chances = game.maxChances;
    game.active = true;
    resetBoard();
    debugGame();
}

// UPDATE HIGHSCORE
function updateHighscore() {
    if (game.chances > game.highscore) {
        game.highscore = game.chances;
        saveHighscore();
        updateUI();
        console.info(`🏆 New Highscore : ${game.highscore}`);
    }
}

// PLAYER WINS
function playerWins() {
    console.info("🎉 Player Won!");
    game.active = false;
    revealSecret();
    disableGame();
    setBodyState("correct");
    setMessage("🎉 Correct Number!", "success");
    updateHighscore();
}

// PLAYER LOSES
function playerLoses() {
    console.warn("💀 Game Over");
    game.active = false;
    revealSecret();
    disableGame();
    setBodyState("game-over");
    setMessage("💥 Game Over!", "error");
}

// DECREASE CHANCE
function decreaseChance() {
    game.chances--;
    updateUI();
}

// COMPARE GUESS
function compareGuess(guess) {
    if (guess === game.secretNumber) {
        playerWins();
        return;
    }
    decreaseChance();
    if (game.chances <= 0) {
        playerLoses();
        return;
    }
    if (guess > game.secretNumber) {
        console.log("📈 Too High");
        setMessage("📈 Too High!", "warning");
    } else {
        console.log("📉 Too Low");
        setMessage("📉 Too Low!", "warning");
    }
}

// SHOW DIFFICULTY MENU
function showDifficultyMenu() {
    modal.style.display = "flex";
    disableGame();
}

// CHANGE DIFFICULTY
function changeDifficulty(level) {
    console.info(`⚙ Difficulty selected: ${level}`);
    startGame(level);
}

// CHECK GUESS
function checkGuess() {
    if (!game.active) {
        console.warn("⚠ Game is not active.");
        return;
    }
    const value = guessInput.value.trim();
    if (!validateGuess(value)) {
        shakeInput();
        return;
    }
    const guess = Number(value);
    console.log(`🎯 Player Guess: ${guess}`);
    compareGuess(guess);
    clearInput();
}

// SHAKE INPUT
function shakeInput() {
    guessInput.classList.remove("shake");
    void guessInput.offsetWidth;
    guessInput.classList.add("shake");
}

// POP NUMBER
function popNumber() {
    numberBox.classList.remove("pop");
    void numberBox.offsetWidth;
    numberBox.classList.add("pop");
}

// SUCCESS INPUT EFFECT
function successInput() {
    guessInput.classList.remove("error");
    guessInput.classList.add("success");
}

// ERROR INPUT EFFECT
function errorInput() {
    guessInput.classList.remove("success");
    guessInput.classList.add("error");
}

// RESET INPUT EFFECT
function resetInputEffect() {
    guessInput.classList.remove("success", "error");
}

// OVERRIDE PLAYER WINS
const originalPlayerWins = playerWins;
playerWins = function () {
    successInput();
    popNumber();
    originalPlayerWins();
};

// OVERRIDE PLAYER LOSES
const originalPlayerLoses = playerLoses;
playerLoses = function () {
    errorInput();
    popNumber();
    originalPlayerLoses();
};

// OVERRIDE COMPARE
const originalCompareGuess = compareGuess;
compareGuess = function (guess) {
    resetInputEffect();
    if (guess === game.secretNumber) {
        successInput();
    } else {
        errorInput();
    }
    originalCompareGuess(guess);
};

// INPUT VALIDATION EFFECT
guessInput.addEventListener("input", () => {
    resetInputEffect();
});

// INPUT LIMIT
guessInput.addEventListener("input", () => {
    let value = Number(guessInput.value);
    if (value > game.range) {
        guessInput.value = game.range;
    }
});

console.info(" Gameplay Logic Loaded");

// EVENT LISTENERS
checkBtn.addEventListener("click", checkGuess);

againBtn.addEventListener("click", () => {
    console.info("🔄 Restart Requested");
    showDifficultyMenu();
});

guessInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    checkGuess();
});

guessInput.addEventListener("input", () => {
    let value = Number(guessInput.value);
    if (value < 0) {
        guessInput.value = "";
    }
});

guessInput.addEventListener("change", () => {
    guessInput.value = guessInput.value.trim();
});

// WINDOW EVENTS
window.addEventListener("focus", () => {
    if (!game.active) return;
    guessInput.focus();
});

window.addEventListener("beforeunload", () => {
    console.info("👋 Thanks for Playing!");
});

// APP INITIALIZATION
function init() {
    console.log(" Game Initialization");
    updateUI();
    hideSecret();
    clearInput();
    disableGame();
    setBodyState();
    setMessage("🎮 Select Difficulty");
    modal.style.display = "flex";
   
}

// START APPLICATION
init();

console.info(" App Loaded Successfully");