const words = [
  "pikachu",
  "charizard",
  "bulbasaur",
  "squirtle",
  "jigglypuff",
  "meowth",
  "psyduck",
  "snorlax",
  "gengar",
  "eevee",
  "dragonite",
  "mewtwo",
  "lapras",
  "vulpix",
  "machamp",
  "ditto",
  "magikarp",
  "abra",
  "ghastly",
  "golem",
  "moltres",
  "articuno",
  "zapdos",
  "mario",
  "luigi",
  "zelda",
  "link",
  "samus",
  "kirby",
  "fox",
  "pikmin",
  "donkeykong",
  "yoshi",
  "metroid",
  "kirby",
  "falco",
  "ninja",
  "sonic",
  "tails",
  "shadow",
  "knuckles",
];

let timer;
let timeLeft;
let score = 0;
let wordDisplay = document.getElementById("word-display");
let wordInput = document.getElementById("word-input");
let timerDisplay = document.getElementById("timer");
let scoreDisplay = document.getElementById("score");
let startButton = document.getElementById("start-game");
let difficultySelect = document.getElementById("difficulty");
let resultMessage = document.getElementById("result-message");

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
  gsap.to(".container", { duration: 1, scale: 1.05, ease: "power1.out" });
  resultMessage.style.display = "none";
  resultMessage.textContent = "";
  const difficulty = difficultySelect.value;
  timeLeft = difficulty === "easy" ? 30 : difficulty === "medium" ? 20 : 10;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  wordInput.value = "";
  wordInput.focus();
  newWord();
  if (timer) clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function newWord() {
  gsap.fromTo(
    "#word-display",
    { scale: 0, rotation: 360 },
    { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
  );
  wordDisplay.textContent = getRandomWord();
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    showResult("You lost! 😢");
  }
}

wordInput.addEventListener("input", () => {
  if (wordInput.value === wordDisplay.textContent) {
    // Correct word typed
    wordInput.style.borderColor = "green";
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    timeLeft += 3; // Increase time by 3 seconds
    newWord();
    wordInput.value = "";
  } else if (!wordDisplay.textContent.startsWith(wordInput.value)) {
    // Incorrect word or incorrect letter sequence typed
    wordInput.style.borderColor = "red"; // Set border color to red for incorrect input
    gsap.fromTo(
      wordInput,
      { scale: 1 },
      { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  } else {
    wordInput.style.borderColor = "black"; // Reset border color if the input is partially correct
  }

  if (score >= 10) {
    clearInterval(timer);
    showResult("You won! 🎉");
  }
});

startButton.addEventListener("click", () => {
  wordInput.disabled = false;
  startGame();
});

function showResult(message) {
  resultMessage.textContent = message;
  resultMessage.style.display = "block";
  gsap.fromTo(
    "#result-message",
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.75)" }
  );
  wordInput.disabled = true;

  if (message === "You lost! 😢" && score >= 10) {
    gsap.to(".container", {
      duration: 2,
      backgroundColor: "#28a745",
      ease: "power1.inOut",
    });
    resultMessage.textContent = "You won! 🎉";
  }
}
