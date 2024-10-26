"use strict";

const ARROW_KEYS = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
const TOTAL_SEQUENCES = 3;

let currentSequence = [];
let enteredSequence = [];
let sequenceCount = 0;

const lobby = document.querySelector(".lobby");
const stage = document.querySelector(".stage");
const score = document.querySelector(".score");

stage.style.display = "none";
score.style.display = "none";

const playNow = document.querySelector(".lobby .btn--primary");

playNow.onclick = function () {
  lobby.style.display = "none";
  stage.style.display = "flex";
};

const goBack = document.querySelector(".stage .btn--icon");

goBack.onclick = function () {
  lobby.style.display = "flex";
  stage.style.display = "none";
};

let startTime = 0;
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
}

function resetTimer() {
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  document.querySelector(".stage__content-timer").textContent = "00:00.00";
}

function formatElapsedTime(time) {
  const totalMs = time % 1000;
  const totalS = Math.floor((time / 1000) % 60);
  const totalMin = Math.floor((time / (1000 * 60)) % 60);

  const formattedMs = String(Math.floor(totalMs / 10)).padStart(2, "0");
  const formattedS = String(totalS).padStart(2, "0");
  const formattedMin = String(totalMin).padStart(2, "0");

  return `${formattedMin}:${formattedS}.${formattedMs}`;
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  document.querySelector(".stage__content-timer").textContent =
    formatElapsedTime(elapsedTime);
}

function getElapsedTime() {
  return formatElapsedTime(elapsedTime);
}

function generateRandomSequence() {
  const randomSequence = [];

  for (let i = 0; i < 6; i++)
    randomSequence.push(ARROW_KEYS[Math.floor(Math.random() * 4)]);

  return randomSequence;
}

function appendSequence(sequence) {
  const arrowsContainer = document.querySelector(".stage__arrows-container");
  arrowsContainer.replaceChildren();

  const keyIcons = document.querySelectorAll(".key-icon");

  for (let i = 0; i < sequence.length; i++) {
    for (let j = 0; j < keyIcons.length; j++) {
      const keyIcon = keyIcons[j].content.cloneNode(true);
      const key = keyIcon.firstElementChild.dataset.key;

      if (sequence[i] === key) {
        arrowsContainer.appendChild(keyIcon);
        break;
      }
    }
  }
}

function checkSequence() {
  for (let i = 0; i < enteredSequence.length; i++) {
    if (enteredSequence[i] !== currentSequence[i]) {
      return false;
    } else {
      const keyIcons = document
        .querySelector(".stage__arrows-container")
        .querySelectorAll("svg");

      keyIcons[i].firstElementChild.setAttribute("fill", "#4a4a4a");
    }
  }

  return true;
}

function handleKeydown(e) {
  if (!ARROW_KEYS.includes(e.key)) return;

  enteredSequence.push(e.key);

  if (!checkSequence()) {
    enteredSequence = [];
    currentSequence = generateRandomSequence();
    appendSequence(currentSequence);
  } else if (enteredSequence.length === currentSequence.length) {
    sequenceCount++;

    if (sequenceCount >= TOTAL_SEQUENCES) {
      currentSequence = [];
      enteredSequence = [];
      sequenceCount = 0;

      stopTimer();
      const elapsedTime = getElapsedTime();
      resetTimer();

      document.querySelector(".stage__arrows-container").replaceChildren();

      startGame.style.display = "inline-flex";
      goBack.style.display = "grid";

      stage.style.display = "none";
      score.style.display = "flex";

      document.querySelector(
        ".score__subheadline"
      ).textContent = `Your time: ${elapsedTime}. Ready to play again?`;
    } else {
      enteredSequence = [];
      currentSequence = generateRandomSequence();
      appendSequence(currentSequence);
    }
  }
}

const startGame = document.querySelector(".stage .btn--primary");

startGame.onclick = function () {
  startGame.style.display = "none";
  goBack.style.display = "none";

  currentSequence = generateRandomSequence();
  appendSequence(currentSequence);
  startTimer();

  document.addEventListener("keydown", handleKeydown);
};

const playAgain = document.querySelector(".score .btn--primary");

playAgain.onclick = function () {
  stage.style.display = "flex";
  score.style.display = "none";
};
