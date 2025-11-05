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
const fireworksVideo = document.getElementById("fireworksVideo");
const fireworksSound = document.getElementById("fireworksSound");
const hintBtn = document.getElementById("hintBtn");

let solution = "";
let solutionClue = "";
let currentPlayer = localStorage.getItem('currentPlayer') || 'Guest';

// Placeholder word array
const WORDS = [
  {word:"BALL", clue:"Used in many games"},
  {word:"BIRD", clue:"Animal that flies in the sky"},
  {word:"BOOK", clue:"Something you read"},
  {word:"CAMP", clue:"Place where you sleep outside"},
  {word:"CARD", clue:"Used to play games or write messages"},
  {word:"COIN", clue:"Metal money you can find in your pocket"},
  {word:"FISH", clue:"Lives in water and swims"},
  {word:"FOOD", clue:"Something you eat"},
  {word:"GAME", clue:"Activity played for fun"},
  {word:"HAND", clue:"Part of your arm you use to grab"},
  {word:"HOME", clue:"Where you live"},
  {word:"JUMP", clue:"Move off the ground with your legs"},
  {word:"KITE", clue:"Flies high in the sky"},
  {word:"LAMP", clue:"Gives light in a room"},
  {word:"LOVE", clue:"A feeling you have for family or friends"},
  {word:"MOON", clue:"Shines at night in the sky"},
  {word:"NOTE", clue:"Something written down to remember"},
  {word:"PLAN", clue:"To decide what you will do"},
  {word:"ROAD", clue:"Where cars and bikes go"},
  {word:"ROCK", clue:"A hard piece of stone"},
  {word:"SHIP", clue:"Boat that sails in the water"},
  {word:"STAR", clue:"Shines in the night sky"},
  {word:"TREE", clue:"A plant with a trunk and leaves"},
  {word:"WALL", clue:"Builds part of a house"},
  {word:"WOOD", clue:"Material from trees"},
  {word:"FIRE", clue:"Hot and can burn things"},
  {word:"RAIN", clue:"Falls from clouds"},
  {word:"SNOW", clue:"White ice that falls from the sky"},
  {word:"COWS", clue:"Farm animal that gives milk"},
  {word:"DUCK", clue:"Bird that swims in ponds"},
  {word:"BEAR", clue:"Big animal that hibernates in winter"},
  {word:"LION", clue:"King of the jungle"},
  {word:"WOLF", clue:"Wild animal that howls"},
  {word:"FROG", clue:"Jumps and croaks"},
  {word:"DEER", clue:"Animal with antlers"},
  {word:"GOAT", clue:"Farm animal that eats grass"},
  {word:"PIGS", clue:"Pink farm animals that roll in mud"},
  {word:"CATS", clue:"Small furry pets"},
  {word:"DOGS", clue:"Man’s best friend"},
  {word:"HENS", clue:"Female chickens"},
  {word:"DUEL", clue:"A fight between two people"},
  {word:"MATH", clue:"School subject with numbers"},
  {word:"DRAW", clue:"Make pictures with a pencil"},
  {word:"PLAY", clue:"Have fun or do games"},
  {word:"READ", clue:"Look at words and understand them"},
  {word:"COOK", clue:"Prepare food to eat"},
  {word:"WALK", clue:"Move on your feet"},
  {word:"RUNS", clue:"Move quickly on your feet"},
  {word:"JUMP", clue:"Spring into the air"},
  {word:"SWIM", clue:"Move through water"},
  {word:"DIVE", clue:"Go headfirst into water"},
  {word:"RACE", clue:"Competition to see who is fastest"},
  {word:"PLAY", clue:"Engage in a game"},
  {word:"TOOL", clue:"Used to fix or make things"},
  {word:"ROPE", clue:"Used to tie or pull things"},
  {word:"BOWL", clue:"Holds food or is rolled in a game"},
  {word:"FORK", clue:"Used to eat food"},
  {word:"HOPE", clue:"Wish something good happens"},
  {word:"HELP", clue:"Give assistance to someone"},
  {word:"WISH", clue:"Want something to happen"},
  {word:"GIFT", clue:"Something you give to someone"},
  {word:"LOVE", clue:"Strong affection"},
  {word:"KING", clue:"A male ruler"},
  {word:"CAGE", clue:"Place where animals are kept"},
  {word:"LION", clue:"Big cat in the jungle"},
  {word:"BEET", clue:"A root vegetable"},
  {word:"PEAR", clue:"Sweet green fruit"},
  {word:"PLUM", clue:"Small purple fruit"},
  {word:"PEAS", clue:"Green small vegetables"},
  {word:"RICE", clue:"Grain used for food"},
  {word:"MILK", clue:"White drink from cows"},
  {word:"EGGS", clue:"Laid by chickens"},
  {word:"BONE", clue:"Part of skeleton"},
  {word:"CLAY", clue:"Used to make pottery"},
  {word:"SAND", clue:"Tiny rocks on the beach"},
  {word:"DUST", clue:"Small dirt particles"},
  {word:"SOAP", clue:"Used to wash hands"},
  {word:"BATH", clue:"Used to get clean"},
  {word:"PARK", clue:"Place to play outside"},
  {word:"PATH", clue:"A way to walk"},
  {word:"ROAD", clue:"Where cars go"},
  {word:"RAIL", clue:"Tracks for a train"},
  {word:"CAMP", clue:"Sleep outdoors"},
  {word:"TENT", clue:"Shelter in camping"},
  {word:"FORK", clue:"Utensil to eat food"},
  {word:"SPOT", clue:"A small mark or place"},
  {word:"SIGN", clue:"Shows information"},
  {word:"BELL", clue:"Makes a ringing sound"},
  {word:"HORN", clue:"Sound maker on a car"},
  {word:"NOTE", clue:"Something written down"},
  {word:"BOOK", clue:"Read for fun or school"},
  {word:"PEN", clue:"Used to write words"},
  {word:"INKS", clue:"Liquid for writing"},
  {word:"CARD", clue:"Piece of paper for writing"},
  {word:"GAME", clue:"Fun activity or sport"},
  {word:"PLAY", clue:"Have fun with others"},
  {word:"TOYS", clue:"Objects for kids to play with"},
  {word:"CUP", clue:"Holds liquids for drinking"},
  {word:"MUGS", clue:"Cup with handle for drinks"},
  {word:"BAG", clue:"Used to carry items"},
  {word:"BOX", clue:"Container to hold things"},
  {word:"COIN", clue:"Metal money"},
  {word:"FLAG", clue:"Represents a country"},
  {word:"STAR", clue:"Shines in the night sky"},
  {word:"MOON", clue:"Shines at night"},
  {word:"APPLE", clue:"A sweet fruit"},
  {word:"BREAD", clue:"We eat it in slices"},
  {word:"CANDY", clue:"Sweet treat for kids"},
  {word:"HOUSE", clue:"Place where people live"},
  {word:"GHOST", clue:"Invisible spooky being"},
  {word:"KITES", clue:"Flies high on windy days"},
  {word:"LAMPY", clue:"Gives light in a room"},
  {word:"MOONS", clue:"Shines at night in the sky"},
  {word:"NURSE", clue:"Helps sick people get better"},
  {word:"PIZZA", clue:"Cheesy round food with toppings"},
  {word:"QUEEN", clue:"Female ruler with a crown"},
  {word:"RAINY", clue:"When water falls from clouds"},
  {word:"SNAKE", clue:"A slithery animal"},
  {word:"TABLE", clue:"Furniture you eat meals on"},
  {word:"WATER", clue:"Clear drink we all need"},
  {word:"YACHT", clue:"Fancy boat that sails"},
  {word:"ZEBRA", clue:"Black and white striped animal"},
  {word:"BALLS", clue:"Round things used in games"},
  {word:"CLOUD", clue:"Fluffy white stuff in the sky"},
  {word:"DRINK", clue:"Something you drink"},
  {word:"EARTH", clue:"Our planet"},
  {word:"FROGS", clue:"Green animals that jump"},
  {word:"GRAPE", clue:"Small fruit, can be purple or green"},
  {word:"HORSE", clue:"Animal people ride"},
  {word:"IGLOO", clue:"House made of ice"},
  {word:"JELLY", clue:"Sweet spread for toast"},
  {word:"KNIFE", clue:"Used to cut food"},
  {word:"LEMON", clue:"Yellow sour fruit"},
  {word:"MOUSE", clue:"Small animal with a tail"},
  {word:"NINJA", clue:"Stealthy fighter from stories"},
  {word:"PANDA", clue:"Black and white bear"},
  {word:"ROBOT", clue:"Mechanical helper"},
  {word:"SHEEP", clue:"Fluffy farm animal"},
  {word:"TIGER", clue:"Striped wild cat"},
  {word:"VASES", clue:"Holds flowers"},
  {word:"WHALE", clue:"Huge sea animal"},
  {word:"YOUNG", clue:"Not old"},
  {word:"ACORN", clue:"Seed of an oak tree"},
  {word:"BLINK", clue:"Quickly close and open your eyes"},
  {word:"CRAZY", clue:"Acting wild or funny"},
  {word:"DRIVE", clue:"Control a vehicle and go"},
  {word:"ELBOW", clue:"Joint between arm and forearm"},
  {word:"FUNNY", clue:"Makes people laugh"},
  {word:"GROVE", clue:"Small group of trees"},
  {word:"HUMAN", clue:"A person"},
  {word:"JUMBO", clue:"Very large size"},
  {word:"KINDS", clue:"Different types of things"},
  {word:"LEARN", clue:"To gain knowledge"},
  {word:"MUSIC", clue:"Sounds arranged to be pleasant"},
  {word:"NURSE", clue:"Helps sick people"},
  {word:"OCEAN", clue:"Large body of water"},
  {word:"PAINT", clue:"Used to color pictures or walls"},
  {word:"QUEST", clue:"A mission or search"},
  {word:"RIGHT", clue:"Opposite of left or correct"},
  {word:"SCALE", clue:"Used to weigh things"},
  {word:"TRAIN", clue:"Vehicle that runs on tracks"},
  {word:"UNDER", clue:"Below something"},
  {word:"VISIT", clue:"Go to see someone or somewhere"},
  {word:"WORLD", clue:"All people and places on Earth"},
  {word:"YIELD", clue:"Give way or produce"},
  {word:"ZEBRA", clue:"Striped black and white animal"},
  {word:"ABOUT", clue:"Concerning something"},
  {word:"BIRTH", clue:"When a baby is born"},
  {word:"CHAIR", clue:"Something you sit on"},
  {word:"DEATH", clue:"Opposite of life"},
  {word:"ELVES", clue:"Small magical creatures"},
  {word:"FAITH", clue:"Strong belief in something"},
  {word:"GIANT", clue:"Very big person or thing"},
  {word:"HEART", clue:"Organ that pumps blood"},
  {word:"IDEAS", clue:"Thoughts or plans"},
  {word:"JOKER", clue:"Funny card or person"},
  {word:"KNACK", clue:"A special skill"},
  {word:"LIGHT", clue:"Helps you see in the dark"},
  {word:"MONEY", clue:"Used to buy things"},
  {word:"NORTH", clue:"One of the directions"},
  {word:"OFFER", clue:"Present something for acceptance"},
  {word:"PRIZE", clue:"Award for winning"},
  {word:"QUEST", clue:"A mission or adventure"},
  {word:"RIVER", clue:"Water flowing to the sea"},
  {word:"SWORD", clue:"A weapon for fighting"},
  {word:"TOWER", clue:"Tall building or structure"},
  {word:"UNITY", clue:"Being together as one"},
  {word:"VALUE", clue:"Importance or worth"},
  {word:"WATER", clue:"We drink it"},
  {word:"YEARN", clue:"To want something strongly"},
  {word:"ZONED", clue:"Divided into areas"},
  {word:"ANGEL", clue:"A kind spiritual being"},
  {word:"BRAVE", clue:"Not afraid"},
  {word:"CHEST", clue:"Part of your body or box"},
  {word:"DREAM", clue:"Things you imagine while sleeping"},
  {word:"EARLY", clue:"Before the usual time"},
  {word:"FAIRY", clue:"Magical little creature"},
  {word:"GLASS", clue:"Transparent material"},
  {word:"HAPPY", clue:"Feeling good and smiling"},
  {word:"IMAGE", clue:"Picture of something"},
  {word:"JUICE", clue:"Drink from fruit"},
  {word:"KNIFE", clue:"Used to cut food"},
  {word:"LIGHT", clue:"Shines so you can see"},
  {word:"MAGIC", clue:"Something mysterious or special"},
  {word:"NIGHT", clue:"Time when it is dark"},
  {word:"OCEAN", clue:"Big water body"},
  {word:"PEACH", clue:"Juicy sweet fruit"},
  {word:"QUEST", clue:"A mission or journey"},
  {word:"RABBI", clue:"Teacher in Jewish community"},
  {word:"SHARK", clue:"Big fish that can bite"},
  {word:"TRAIN", clue:"Runs on tracks"},
  {word:"ULTRA", clue:"Extreme or beyond"},
  {word:"VIXEN", clue:"Female fox"},
  {word:"WHALE", clue:"Large sea mammal"},
  {word:"YOUNG", clue:"Not old"},
  {word:"ZEBRA", clue:"Striped animal"},
  {word:"BANANA", clue:"A long yellow fruit"},
  {word:"GUITAR", clue:"Instrument with strings you play"},
  {word:"ORANGE", clue:"Round citrus fruit"},
  {word:"MARKER", clue:"Used to draw or write"},
  {word:"FRIDGE", clue:"Keeps food cold"},
  {word:"PUZZLE", clue:"Piece together to solve"},
  {word:"BALLET", clue:"Dance on toes in shows"},
  {word:"CAMERA", clue:"Takes photographs"},
  {word:"MONKEY", clue:"Animal that climbs trees"},
  {word:"BOTTLE", clue:"Holds water or drink"},
  {word:"POCKET", clue:"Small pouch in clothes"},
  {word:"ROCKET", clue:"Launches into space"},
  {word:"BRIDGE", clue:"Structure to cross over water"},
  {word:"TUNNEL", clue:"Underground passage"},
  {word:"SPIDER", clue:"Eight-legged creature"},
  {word:"PLANET", clue:"Orbits a star like the Sun"},
  {word:"FRIEND", clue:"Someone you like and trust"},
  {word:"WINDOW", clue:"Lets light into a room"},
  {word:"CANDLE", clue:"Gives light and can melt"},
  {word:"FLOWER", clue:"Grows from the ground and blooms"},
  {word:"BRIGHT", clue:"Full of light or shining"},
  {word:"SCHOOL", clue:"Place to learn"},
  {word:"FAMILY", clue:"People related to you"},
  {word:"MARKET", clue:"Place to buy food"},
  {word:"BREEZE", clue:"A gentle wind"},
  {word:"PRINCE", clue:"Male royal"},
  {word:"LITTLE", clue:"Small in size"},
  {word:"NATURE", clue:"Plants, animals, and outdoors"},
  {word:"SUMMER", clue:"Hot season"},
  {word:"WINTER", clue:"Cold season"},
  {word:"SPRING", clue:"Season when flowers bloom"},
  {word:"AUTUMN", clue:"Season with falling leaves"},
  {word:"FOREST", clue:"Many trees together"},
  {word:"ANIMAL", clue:"Lives, breathes, moves"},
  {word:"MARVEL", clue:"Amazing or wonderful"},
  {word:"CIRCLE", clue:"Round shape"},
  {word:"FIGURE", clue:"Shape or number"},
  {word:"BUTTON", clue:"Used to fasten clothes"},
  {word:"FROZEN", clue:"Turned into ice"},
  {word:"STREAM", clue:"Small flowing water"},
  {word:"TUNING", clue:"Adjusting musical instruments"},
  {word:"LANTERN", clue:"Portable light"},
  {word:"MIRROR", clue:"Reflects your image"},
  {word:"GARDEN", clue:"Place where plants grow"},
  {word:"POCKET", clue:"Small storage in clothes"},
  {word:"BRIDGE", clue:"Connects two places"},
  {word:"MARKER", clue:"Used to write or draw"},
  {word:"SPIDER", clue:"Eight-legged creature"},
  {word:"WINDOW", clue:"Lets light in"},
  {word:"CANDLE", clue:"Gives light"},
  {word:"FLOWER", clue:"Blooms in gardens"},
  {word:"BUTTON", clue:"Fastens clothes"},
  {word:"PLANET", clue:"Orbits a star"},
  {word:"FRIEND", clue:"Someone you like"},
  {word:"ROCKET", clue:"Shoots into space"},
  {word:"FOREST", clue:"Many trees together"},
  {word:"SUMMER", clue:"Hot season"},
  {word:"WINTER", clue:"Cold season"},
  {word:"AUTUMN", clue:"Season of falling leaves"},
  {word:"SPRING", clue:"Season of flowers"},
  {word:"STREAM", clue:"Small river"},
  {word:"GUITAR", clue:"Musical instrument"},
  {word:"BALLET", clue:"Dance on toes"},
  {word:"CAMERA", clue:"Takes photos"},
  {word:"MONKEY", clue:"Climbs trees"},
  {word:"BANANA", clue:"Yellow fruit"},
  {word:"LANTERN", clue:"Portable light"},
  {word:"MIRROR", clue:"Reflects your image"},
  {word:"GARDEN", clue:"Where plants grow"},
  {word:"FIGURE", clue:"Shape or number"},
  {word:"CIRCLE", clue:"Round shape"},
  {word:"MARVEL", clue:"Amazing or wonderful"},
  {word:"FROZEN", clue:"Turned into ice"},
  {word:"BUTTON", clue:"Fastens clothes"},
  {word:"BRIGHT", clue:"Full of light"},
  {word:"WINDOW", clue:"Lets light in"},
  {word:"FLOWER", clue:"Blooms in gardens"},
  {word:"MARKET", clue:"Place to buy food"},
  {word:"FRIEND", clue:"Someone you like"},
  {word:"PRINCE", clue:"Male royal"},
  {word:"ANIMAL", clue:"Lives, breathes, moves"},
  {word:"NATURE", clue:"Plants and animals"},
  {word:"SUMMER", clue:"Hot season"},
  {word:"WINTER", clue:"Cold season"},
  {word:"SPRING", clue:"Season of flowers"},
  {word:"AUTUMN", clue:"Season with falling leaves"},
  {word:"FOREST", clue:"Many trees together"},
  {word:"SCHOOL", clue:"Place to learn"},
  {word:"FAMILY", clue:"People related to you"},
  {word:"BRIDGE", clue:"Connects two places"},
  {word:"ROCKET", clue:"Shoots into space"},
  {word:"POCKET", clue:"Small pouch in clothes"},
  {word:"BOTTLE", clue:"Holds liquids"},
  {word:"MARKER", clue:"Used to write or draw"},
  {word:"GUITAR", clue:"Musical instrument"},
  {word:"CAMERA", clue:"Takes photos"},
  {word:"BALLET", clue:"Dance on toes"},
  {word:"LANTERN", clue:"Portable light"},
  {word:"MIRROR", clue:"Reflects your image"},
  {word:"GARDEN", clue:"Where plants grow"},
  {word:"BUTTON", clue:"Fastens clothes"},
  {word:"PLANET", clue:"Orbits a star"}
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
    const obj = WORDS[Math.floor(Math.random() * WORDS.length)];
    solution = obj.word.toUpperCase();
    solutionClue = obj.clue;
    wordLengthDisplay.textContent = `Today's word uses ${solution.length} letters`;

    // Log word for testing
    console.log("DEBUG: Today's word is:", solution);
}

function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${solution.length}, 50px)`; // horizontal tiles
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

    // Letter keys
    layout.forEach(letter => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.textContent = letter;
        key.addEventListener('click', () => handleKey(letter));
        keyboardDiv.appendChild(key);
    });

    // Enter key
    const enterKey = document.createElement('div');
    enterKey.classList.add('key');
    enterKey.textContent = 'ENTER';
    enterKey.addEventListener('click', submitGuess);
    keyboardDiv.appendChild(enterKey);

    // Backspace key
    const backKey = document.createElement('div');
    backKey.classList.add('key');
    backKey.textContent = '⌫';
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
// Fireworks Video + Sound
// ----------------------------
function launchFireworks(){
    // Video
    fireworksVideo.style.display='block';
    fireworksVideo.currentTime=0;
    fireworksVideo.play();

    // Sound
    fireworksSound.currentTime=0;
    fireworksSound.play();

    setTimeout(()=>{
        fireworksVideo.pause();
        fireworksVideo.style.display='none';
        fireworksSound.pause();
    },5000);
}

const howToPlayBtn = document.getElementById("howToPlayBtn");
const howToPlayModal = document.getElementById("howToPlayModal");
const closeHowToPlay = howToPlayModal.querySelector(".close");


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

newGameBtn.addEventListener('click', ()=>{ resetGame(); });

statsBtn.addEventListener('click', ()=>{ statsModal.style.display='block'; });
closeModal.addEventListener('click', ()=>{ statsModal.style.display='none'; });
homeBtn.addEventListener('click', ()=>{ window.location.href = 'index.html'; });

hintBtn.addEventListener("click", ()=>{
    if(solutionClue){
        message.textContent = `💡 Hint: ${solutionClue}`;
    } else {
        message.textContent = "No hint available!";
    }
});

window.addEventListener('click', (e)=>{
    if(e.target === statsModal) statsModal.style.display='none';
});

howToPlayBtn.addEventListener("click", ()=>{
    howToPlayModal.style.display = "block";
});

closeHowToPlay.addEventListener("click", ()=>{
    howToPlayModal.style.display = "none";
});

// Close modal if clicked outside
window.addEventListener('click', (e)=>{
    if(e.target === howToPlayModal) howToPlayModal.style.display='none';
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
