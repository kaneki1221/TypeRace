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
  "gastly",
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
  "falco",
  "ninja",
  "sonic",
  "tails",
  "shadow",
  "knuckles",
  "kratos",
  "cortana",
  "masterchief",
  "tracer",
  "sombra",
  "widowmaker",
];

const state = {
  typing: { timer: null, timeLeft: 30, score: 0, isRunning: false },
  scramble: { current: "", scrambled: "", attempts: 3, streak: 0, score: 0 },
  reaction: {
    waiting: false,
    ready: false,
    startTime: 0,
    timeoutId: null,
    best: null,
    last: null,
    score: 0,
  },
};

const labels = {
  typing: "Typing Sprint",
  scramble: "Word Scramble",
  reaction: "Reaction Rush",
};

// Global UI
const globalScore = document.getElementById("global-score");
const globalTimer = document.getElementById("global-timer");
const activeModeLabel = document.getElementById("active-mode");
const modeButtons = document.querySelectorAll(".mode-button");
const panels = document.querySelectorAll(".game-panel");
let activeMode = "typing";

// Typing references
const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-game");
const difficultySelect = document.getElementById("difficulty");
const resultMessage = document.getElementById("result-message");

// Scramble references
const scrambledWordEl = document.getElementById("scrambled-word");
const scrambleInput = document.getElementById("scramble-input");
const scrambleAttemptsEl = document.getElementById("scramble-attempts");
const scrambleStreakEl = document.getElementById("scramble-streak");
const scrambleMessage = document.getElementById("scramble-message");
const scrambleStartBtn = document.getElementById("scramble-start");

// Reaction references
const reactionArena = document.getElementById("reaction-arena");
const reactionPrompt = document.getElementById("reaction-prompt");
const reactionStartBtn = document.getElementById("reaction-start");
const reactionBest = document.getElementById("reaction-best");
const reactionLast = document.getElementById("reaction-last");

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function updateGlobalStatus(mode = activeMode) {
  const current = state[mode];
  activeModeLabel.textContent = labels[mode];
  globalScore.textContent = current.score ?? current.streak ?? 0;

  if (mode === "typing") {
    globalTimer.textContent = `${current.timeLeft ?? 0}s`;
  } else if (mode === "scramble") {
    globalTimer.textContent = `${current.attempts ?? 0} tries`;
  } else {
    globalTimer.textContent = current.last ? `${current.last}ms` : "--";
  }
}

function switchMode(mode) {
  activeMode = mode;
  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${mode}-panel`);
  });
  updateGlobalStatus();
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

// Typing Sprint --------------------------------------------------
function startTypingGame() {
  gsap.to("#typing-panel", {
    duration: 0.6,
    scale: 1.01,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });
  const difficulty = difficultySelect.value;
  const baseTime =
    difficulty === "easy" ? 30 : difficulty === "medium" ? 22 : 12;
  state.typing.timeLeft = baseTime;
  state.typing.score = 0;
  state.typing.isRunning = true;
  wordInput.disabled = false;
  wordInput.value = "";
  wordInput.focus();
  scoreDisplay.textContent = state.typing.score;
  timerDisplay.textContent = state.typing.timeLeft;
  resultMessage.textContent = "";
  resultMessage.style.color = "var(--accent-2)";

  newTypingWord();
  if (state.typing.timer) clearInterval(state.typing.timer);
  state.typing.timer = setInterval(updateTypingTimer, 1000);
  updateGlobalStatus("typing");
}

function newTypingWord() {
  const word = getRandomWord();
  wordDisplay.textContent = word;
  gsap.fromTo(
    "#word-display",
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.8)" }
  );
}

function updateTypingTimer() {
  state.typing.timeLeft -= 1;
  timerDisplay.textContent = state.typing.timeLeft;
  if (state.typing.timeLeft <= 0) {
    finishTyping("Time's up! 😢");
  }
  updateGlobalStatus("typing");
}

function finishTyping(message) {
  clearInterval(state.typing.timer);
  state.typing.isRunning = false;
  wordInput.disabled = true;
  resultMessage.textContent = message;
  resultMessage.style.color = message.includes("won")
    ? "var(--success)"
    : "var(--danger)";
  gsap.fromTo(
    "#result-message",
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1,0.6)" }
  );
}

wordInput.addEventListener("input", () => {
  if (!state.typing.isRunning) return;
  const target = wordDisplay.textContent;
  const value = wordInput.value.trim();

  if (target.startsWith(value)) {
    wordInput.style.borderColor = "var(--accent)";
  } else {
    wordInput.style.borderColor = "var(--danger)";
    gsap.fromTo(
      wordInput,
      { x: -3 },
      { x: 3, duration: 0.1, repeat: 3, yoyo: true }
    );
  }

  if (value === target) {
    wordInput.value = "";
    state.typing.score += 1;
    state.typing.timeLeft += 3;
    scoreDisplay.textContent = state.typing.score;
    timerDisplay.textContent = state.typing.timeLeft;
    wordInput.style.borderColor = "var(--success)";
    newTypingWord();
    updateGlobalStatus("typing");

    if (state.typing.score >= 12) {
      finishTyping("You won! 🎉");
    }
  }
});

startButton.addEventListener("click", startTypingGame);

// Word Scramble ---------------------------------------------------
function scrambleWord(word) {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const scrambled = letters.join("");
  return scrambled === word ? scrambleWord(word) : scrambled;
}

function startScramble() {
  state.scramble.current = getRandomWord();
  state.scramble.scrambled = scrambleWord(state.scramble.current);
  state.scramble.attempts = 3;
  scrambleAttemptsEl.textContent = state.scramble.attempts;
  scrambledWordEl.textContent = state.scramble.scrambled.toUpperCase();
  scrambleInput.value = "";
  scrambleInput.disabled = false;
  scrambleInput.focus();
  scrambleMessage.textContent = "";
  updateGlobalStatus("scramble");
}

scrambleInput.addEventListener("input", () => {
  if (!state.scramble.current) return;
  const guess = scrambleInput.value.trim().toLowerCase();
  if (guess.length < state.scramble.current.length) return;

  if (guess === state.scramble.current) {
    state.scramble.streak += 1;
    state.scramble.score += 2;
    scrambleStreakEl.textContent = state.scramble.streak;
    scrambleMessage.textContent = "Correct! New scramble incoming.";
    scrambleMessage.style.color = "var(--success)";
    scrambleInput.value = "";
    gsap.fromTo(
      ".scramble-card",
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
    startScramble();
  } else {
    state.scramble.attempts -= 1;
    scrambleAttemptsEl.textContent = state.scramble.attempts;
    scrambleMessage.textContent = "Not quite! Try again.";
    scrambleMessage.style.color = "var(--danger)";
    gsap.fromTo(
      "#scramble-input",
      { x: -3 },
      { x: 3, duration: 0.1, repeat: 3, yoyo: true }
    );

    if (state.scramble.attempts <= 0) {
      scrambleMessage.textContent = `Out of tries! The word was ${state.scramble.current.toUpperCase()}.`;
      scrambleInput.disabled = true;
      scrambledWordEl.textContent = "Tap start to play";
      state.scramble.current = "";
    }
  }
  updateGlobalStatus("scramble");
});

scrambleStartBtn.addEventListener("click", startScramble);

// Reaction Rush ---------------------------------------------------
function startReactionTest() {
  const reactionState = state.reaction;
  clearTimeout(reactionState.timeoutId);
  reactionState.waiting = true;
  reactionState.ready = false;
  reactionPrompt.textContent = "Wait for the glow...";
  reactionArena.classList.remove("ready");

  const delay = Math.random() * 2000 + 800;
  reactionState.timeoutId = setTimeout(() => {
    reactionState.ready = true;
    reactionState.waiting = false;
    reactionState.startTime = performance.now();
    reactionPrompt.textContent = "Tap now!";
    reactionArena.classList.add("ready");
  }, delay);
}

reactionArena.addEventListener("click", () => {
  const reactionState = state.reaction;
  if (reactionState.waiting && !reactionState.ready) {
    reactionPrompt.textContent = "Too soon! Tap start again.";
    reactionPrompt.style.color = "var(--danger)";
    clearTimeout(reactionState.timeoutId);
    reactionState.waiting = false;
    return;
  }

  if (!reactionState.ready) return;

  const elapsed = Math.round(performance.now() - reactionState.startTime);
  reactionState.last = elapsed;
  reactionState.best = reactionState.best
    ? Math.min(reactionState.best, elapsed)
    : elapsed;
  reactionState.score += Math.max(1, Math.floor(400 / elapsed));

  reactionPrompt.textContent = `Nice! ${elapsed}ms`;
  reactionPrompt.style.color = "var(--success)";
  reactionArena.classList.remove("ready");
  reactionState.ready = false;

  reactionLast.textContent = `${elapsed}`;
  reactionBest.textContent = `${reactionState.best}`;
  updateGlobalStatus("reaction");
});

reactionStartBtn.addEventListener("click", () => {
  reactionPrompt.style.color = "var(--text)";
  reactionPrompt.textContent = "Get ready...";
  startReactionTest();
});

// Initial state
updateGlobalStatus();
