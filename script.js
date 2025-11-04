// ----------------------------
// Wordle for Kids - script.js
// ----------------------------

// DOM Elements
const board = document.getElementById("board");
const keyboardDiv = document.getElementById("keyboard");
const message = document.getElementById("message");
const streakDisplay = document.getElementById("streak");
const wordLengthDisplay = document.getElementById("wordLengthDisplay");

const statsBtn = document.getElementById("statsBtn");
const statsModal = document.getElementById("statsModal");
const closeModal = document.querySelector(".close");
const newGameBtn = document.getElementById("newGameBtn");
const toggleBtn = document.getElementById("toggleKeyboardBtn");

// Game Variables
const MAX_GUESSES = 7;
let solution = '';
let currentGuess = '';
let currentRow = 0;

// Keyboard layouts
const QWERTY = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let currentLayout = "QWERTY"; // default
let letterStatus = {}; // Tracks each letter's status (correct, present, absent)

// 300-word array placeholder (replace with your 300 words)
const WORDS = [
"ABLE","ACID","AGED","ALSO","AREA","ARMY","AWAY","BABY","BACK","BALL",
"BAND","BANK","BASE","BATH","BEAR","BEAT","BEEF","BEEN","BEER","BELL",
"BEND","BEST","BILL","BIRD","BLOW","BLUE","BOAT","BODY","BOMB","BONE",
"BOOK","BOOT","BORN","BOSS","BOTH","BOWL","BULB","BURN","BUSH","BUSY",
"CALL","CALM","CAMP","CARD","CARE","CASE","CASH","CAST","CELL","CHAT",
"CHIP","CITY","CLUB","COAL","COAT","CODE","COLD","COME","COOK","COOL",
"COPY","CORE","COST","CREW","CROP","DARK","DATA","DATE","DAWN","DAYS",
"DEAD","DEAL","DEAR","DEBT","DESK","DIAL","DISC","DOOR","DOWN","DRAW",
"EASY","EDGE","ELSE","EVEN","EVER","EXIT","FAIR","FALL","FARM","FAST",
"FATE","FEAR","FEED","FEEL","FIND","FINE","FIRE","FIRM","FISH","FIVE",
"APPLE","BERRY","CHESS","CHAIR","CLOUD","DREAM","EARTH","FIELD","FRUIT","GRASS",
"HEART","HORSE","HOUSE","JUICE","LEMON","LIGHT","MONEY","MOUSE","NURSE","PLANT",
"PRIZE","QUEEN","RIVER","ROBOT","SUGAR","TABLE","TRAIN","TRUST","WATER","WHEEL",
"YEAST","YOUNG","ZEBRA","BRAVE","BRICK","BROOK","CANDY","CATCH","CHAIN","CHEST",
"CHILD","CLEAN","CLOCK","COINS","COUNT","CRAFT","CREAM","DANCE","DEMON","DRIVE",
"EARLY","ENTER","EVENT","FAITH","FAIRY","FANCY","FERRY","FIGHT","FIRST","FLOAT",
"FLOUR","FORCE","FOUND","FRONT","FROST","GLASS","GLOVE","GRAND","GREEN","GUARD",
"HAPPY","HEAVY","HONEY","HOUSE","IDEAL","INDEX","JUICE","KNIFE","LABEL","LARGE",
"LEARN","LIGHT","MAGIC","MARCH","MONEY","MOUSE","NIGHT","NURSE","OCEAN","ORDER",
"PAINT","PLANT","PLATE","POWER","QUEEN","QUICK","RADIO","RIVER","ROBOT","SCALE",
"SCORE","SHINE","SLEEP","SMILE","SPOON","STARS","STEAM","STONE","STORY","TABLE",
"TEACH","THINK","TRUST","VIVID","WATER","WHEEL","WORLD",
"ACCEPT","ACTION","ACTUAL","ADVICE","ANIMAL","ANSWER","BOTTLE","BRIGHT","BRIDGE","BUTTON",
"CANDLE","CIRCLE","CLIENT","CLOSED","COOKIE","DANGER","DESIGN","DETAIL","DOUBLE","EAGLES",
"EDITOR","EITHER","EMPLOY","ENERGY","EVENTS","FAIRLY","FAMILY","FELLOW","FLAVOR","FLOWER",
"FRIEND","GARDEN","GENTLE","HEALTH","HUNTER","IMAGIN","INSIDE","JOURNY","JUNIOR","KINDER",
"LANTER","LETTER","LISTEN","MAGNET","MARKET","MASTER","MEDIUM","MEMORY","MESSAGE","MIRROR",
"MOBILE","MOTHER","MOTION","MUSEUM","NATURE","NUMBER","OFFICE","ORANGE","OUTING","PACKET",
"PEOPLE","PERMIT","PLANET","POCKET","POETRY","POTION","PUZZLE","RADIUS","READER","REPORT",
"RESULT","REWARD","RHYTHM","ROCKET","SCHOOL","SECRET","SERVICE","SILVER","SISTER","SKETCH",
"SPIRIT","STREET","STUDIO","SUMMER","SYSTEM","TEACHR","TEMPLE","THEORY","TICKET","TRAVEL",
"TUNNEL","TURKEY","UNIQUE","UNIVERS","VACUUM","VALLEY","VICTOR","VISUAL","WEALTH","WINDOW",
"WINTER","WONDER","WRITER","YELLOW","YOUNGS","ZEBRAS","ZOOMER","ZODIAC","ZIGZAG","ZAPPER"
];

// Statistics
let totalGames = parseInt(localStorage.getItem("totalGames")) || 0;
let totalWins = parseInt(localStorage.getItem("totalWins")) || 0;
let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
let maxStreak = parseInt(localStorage.getItem("maxStreak")) || 0;
streakDisplay.textContent = currentStreak;

// ----------------------------
// Functions
// ----------------------------
function pickNewWord() {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    solution = WORDS[randomIndex].toUpperCase();
    wordLengthDisplay.textContent = `Today's word uses ${solution.length} letters`;
}

function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${solution.length}, 50px)`;
    for (let r = 0; r < MAX_GUESSES; r++) {
        for (let c = 0; c < solution.length; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            board.appendChild(cell);
        }
    }
}

function updateBoard() {
    const start = currentRow * solution.length;
    for (let i = 0; i < solution.length; i++) {
        const cell = board.children[start + i];
        cell.textContent = currentGuess[i] || '';
    }
}

function showMessage(msg) {
    message.textContent = msg;
}

// ----------------------------
// Keyboard
// ----------------------------
function createKeyboard() {
    keyboardDiv.innerHTML = '';
    const layout = currentLayout === "QWERTY" ? QWERTY : ALPHABET;
    layout.forEach(key => {
        const keyBtn = document.createElement("div");
        keyBtn.classList.add("key");
        keyBtn.textContent = key;
        if (letterStatus[key]) keyBtn.classList.add(letterStatus[key]); // preserve color
        keyBtn.addEventListener("click", () => handleKey(key));
        keyboardDiv.appendChild(keyBtn);
    });
    ["Enter", "Backspace"].forEach(k => {
        const keyBtn = document.createElement("div");
        keyBtn.classList.add("key");
        keyBtn.textContent = k;
        keyBtn.addEventListener("click", () => handleKey(k));
        keyboardDiv.appendChild(keyBtn);
    });
}

function handleKey(key) {
    if (key === "Backspace") currentGuess = currentGuess.slice(0, -1);
    else if (key === "Enter") submitGuess();
    else if (currentGuess.length < solution.length && /^[A-Z]$/.test(key)) currentGuess += key;
    updateBoard();
}

function submitGuess() {
    if (currentGuess.length !== solution.length) {
        showMessage(`Please enter ${solution.length} letters`);
        return;
    }

    const start = currentRow * solution.length;
    for (let i = 0; i < solution.length; i++) {
        const cell = board.children[start + i];
        const letter = currentGuess[i];
        let status = "absent";
        if (letter === solution[i]) status = "correct";
        else if (solution.includes(letter)) status = "present";

        cell.classList.add(status, 'animate');
        setTimeout(() => cell.classList.remove('animate'), 200);

        markKey(letter, status);
        letterStatus[letter] = status;
    }

    if (currentGuess === solution) {
        showMessage("🎉 You guessed it!");
        totalGames++; totalWins++; currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        updateLocalStorage(); updateStatsDisplay(); disableKeyboard(); return;
    }

    currentRow++;
    if (currentRow >= MAX_GUESSES) {
        showMessage(`😢 Game over! The word was ${solution}`);
        totalGames++; currentStreak = 0;
        updateLocalStorage(); updateStatsDisplay(); disableKeyboard();
    }

    currentGuess = '';
}

function markKey(letter, status) {
    const keyBtns = Array.from(keyboardDiv.children);
    const keyBtn = keyBtns.find(k => k.textContent === letter);
    if (!keyBtn) return;
    keyBtn.classList.remove("correct", "present", "absent");
    keyBtn.classList.add(status);
}

function disableKeyboard() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(k => k.replaceWith(k.cloneNode(true)));
}

// ----------------------------
// Physical keyboard support
// ----------------------------
document.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === "Backspace" || /^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

// ----------------------------
// Statistics
// ----------------------------
function updateLocalStorage() {
    localStorage.setItem("totalGames", totalGames);
    localStorage.setItem("totalWins", totalWins);
    localStorage.setItem("currentStreak", currentStreak);
    localStorage.setItem("maxStreak", maxStreak);
}

function updateStatsDisplay() {
    document.getElementById("totalGames").textContent = totalGames;
    document.getElementById("totalWins").textContent = totalWins;
    document.getElementById("currentStreak").textContent = currentStreak;
    document.getElementById("maxStreak").textContent = maxStreak;
    streakDisplay.textContent = currentStreak;
}

// ----------------------------
// Modal
// ----------------------------
statsBtn.addEventListener("click", () => { updateStatsDisplay(); statsModal.style.display = "block"; });
closeModal.addEventListener("click", () => { statsModal.style.display = "none"; });
window.addEventListener("click", e => { if (e.target === statsModal) statsModal.style.display = "none"; });

// ----------------------------
// New Game & Toggle
// ----------------------------
newGameBtn.addEventListener("click", startNewGame);
toggleBtn.addEventListener("click", () => { 
    currentLayout = currentLayout === "QWERTY" ? "ALPHABET" : "QWERTY"; 
    createKeyboard(); 
});

// ----------------------------
// Start / Reset Game
// ----------------------------
function startNewGame() {
    currentRow = 0; currentGuess = '';
    letterStatus = {}; // reset for new game
    pickNewWord();
    createBoard();
    createKeyboard();
    showMessage('');
}

// ----------------------------
// Initialize
// ----------------------------
startNewGame();
updateStatsDisplay();
