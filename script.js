// ----------------------------
// Game Setup and Variables
// ----------------------------
const MAX_GUESSES = 6;
let currentRow = 0;
let currentGuess = '';
let letterStatus = {};
let currentLayout = "QWERTY";

const QWERTY = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const board = document.getElementById("board");
const keyboardDiv = document.getElementById("keyboard");
const message = document.getElementById("message");
const toggleBtn = document.getElementById("toggleKeyboardBtn");
const newGameBtn = document.getElementById("newGameBtn");
const statsBtn = document.getElementById("statsBtn");
const statsModal = document.getElementById("statsModal");
const closeModal = statsModal.querySelector(".close");
const homeBtn = document.getElementById("homeBtn");
const streakDisplay = document.getElementById("streak");
const wordLengthDisplay = document.getElementById("wordLengthDisplay");
const fireworksCanvas = document.getElementById("fireworks");

let solution = "";
let currentPlayer = localStorage.getItem('currentPlayer') || 'Guest';

// Placeholder word array
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

// Stats
let totalGames = parseInt(localStorage.getItem(`${currentPlayer}_totalGames`) || 0);
let totalWins = parseInt(localStorage.getItem(`${currentPlayer}_totalWins`) || 0);
let currentStreak = parseInt(localStorage.getItem(`${currentPlayer}_currentStreak`) || 0);
let maxStreak = parseInt(localStorage.getItem(`${currentPlayer}_maxStreak`) || 0);

// ----------------------------
// Utility Functions
// ----------------------------
function saveStats() {
    localStorage.setItem(`${currentPlayer}_totalGames`, totalGames);
    localStorage.setItem(`${currentPlayer}_totalWins`, totalWins);
    localStorage.setItem(`${currentPlayer}_currentStreak`, currentStreak);
    localStorage.setItem(`${currentPlayer}_maxStreak`, maxStreak);
}

function updateStatsDisplay() {
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('currentStreak').textContent = currentStreak;
    document.getElementById('maxStreak').textContent = maxStreak;
    streakDisplay.textContent = currentStreak;
}

function pickNewWord() {
    solution = WORDS[Math.floor(Math.random() * WORDS.length)];
    wordLengthDisplay.textContent = `Today's word uses ${solution.length} letters`;
}

function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${solution.length}, 50px)`; // fix horizontal tiles
    for (let i = 0; i < MAX_GUESSES; i++) {
        for (let j = 0; j < solution.length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
        }
    }
}


function createKeyboard() {
    keyboardDiv.innerHTML = '';
    let layout = currentLayout === "QWERTY" ? QWERTY : ALPHABET;

    // Create letter keys
    layout.forEach(letter => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.textContent = letter;
        key.addEventListener('click', () => handleKey(letter));
        keyboardDiv.appendChild(key);
    });

    // Add special keys: Enter and Backspace
    const enterKey = document.createElement('div');
    enterKey.classList.add('key');
    enterKey.textContent = 'ENTER';
    enterKey.addEventListener('click', submitGuess);
    keyboardDiv.appendChild(enterKey);

    const backKey = document.createElement('div');
    backKey.classList.add('key');
    backKey.textContent = '⌫'; // Unicode backspace symbol
    backKey.addEventListener('click', () => {
        currentGuess = currentGuess.slice(0, -1);
        renderBoard();
    });
    keyboardDiv.appendChild(backKey);
}


// ----------------------------
// Game Logic
// ----------------------------
function handleKey(letter) {
    if (currentGuess.length < solution.length) {
        currentGuess += letter;
        renderBoard();
    }
}

function submitGuess() {
    if (currentGuess.length !== solution.length) return;
    let correct = true;
    const startIdx = currentRow * solution.length;
    for (let i = 0; i < solution.length; i++) {
        const cell = board.children[startIdx + i];
        if (currentGuess[i] === solution[i]) {
            cell.classList.add('correct', 'animate');
            letterStatus[currentGuess[i]] = 'correct';
        } else if (solution.includes(currentGuess[i])) {
            cell.classList.add('present', 'animate');
            if (!letterStatus[currentGuess[i]]) letterStatus[currentGuess[i]] = 'present';
            correct = false;
        } else {
            cell.classList.add('absent', 'animate');
            letterStatus[currentGuess[i]] = 'absent';
            correct = false;
        }
    }

    updateKeyboardColors();
    if (correct) {
        message.textContent = "🎉 You Win!";
        totalGames++;
        totalWins++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        saveStats();
        updateStatsDisplay();
        launchFireworks();
        return;
    }

    currentRow++;
    currentGuess = '';

    if (currentRow >= MAX_GUESSES) {
        message.textContent = `❌ You Lose! Word was ${solution}`;
        totalGames++;
        currentStreak = 0;
        saveStats();
        updateStatsDisplay();
    }
}

function updateKeyboardColors() {
    document.querySelectorAll('.key').forEach(key => {
        if (letterStatus[key.textContent]) {
            key.classList.remove('correct','present','absent');
            key.classList.add(letterStatus[key.textContent]);
        }
    });
}

function renderBoard() {
    const startIdx = currentRow * solution.length;
    for (let i = 0; i < solution.length; i++) {
        const cell = board.children[startIdx + i];
        cell.textContent = currentGuess[i] || '';
    }
}

// ----------------------------
// Fireworks Effect
// ----------------------------
function launchFireworks() {
    const canvas = fireworksCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    let particles = [];

    function createParticles(x, y) {
        for (let i = 0; i < 50; i++) {
            particles.push({
                x, y,
                dx: (Math.random()-0.5)*8,
                dy: (Math.random()-0.5)*8,
                color: `hsl(${Math.random()*360},100%,50%)`,
                alpha:1
            });
        }
    }

    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha -= 0.02;
            ctx.fillStyle = `hsla(${Math.random()*360},100%,50%,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
        });
        particles = particles.filter(p => p.alpha>0);
        if (particles.length>0) requestAnimationFrame(animate);
    }

    // Launch 5 fireworks at random positions
    for (let i=0;i<5;i++){
        const x = Math.random()*canvas.width;
        const y = Math.random()*canvas.height/2;
        createParticles(x,y);
    }

    animate();
    setTimeout(()=>{canvas.style.display='none';},5000);
}

// ----------------------------
// Event Listeners
// ----------------------------
document.addEventListener('keydown', (e)=>{
    if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    if (e.key === 'Enter') submitGuess();
    if (e.key === 'Backspace') {
        currentGuess = currentGuess.slice(0,-1);
        renderBoard();
    }
});

toggleBtn.addEventListener('click', () => {
    currentLayout = currentLayout === "QWERTY" ? "ALPHABET" : "QWERTY";
    toggleBtn.textContent = currentLayout === "QWERTY" ? "Alpha Keyboard" : "QWERTY Keyboard";
    createKeyboard();
});

newGameBtn.addEventListener('click', ()=>{
    resetGame();
});

statsBtn.addEventListener('click', ()=>{
    statsModal.style.display='block';
});

closeModal.addEventListener('click', ()=>{
    statsModal.style.display='none';
});

homeBtn.addEventListener('click', ()=>{
    window.location.href = 'index.html';
});

window.addEventListener('click', (e)=>{
    if(e.target === statsModal) statsModal.style.display='none';
});

// ----------------------------
// Reset / Initialize Game
// ----------------------------
function resetGame() {
    currentRow=0;
    currentGuess='';
    letterStatus={};
    message.textContent='';
    pickNewWord();
    createBoard();
    createKeyboard();
}

resetGame();
updateStatsDisplay();
