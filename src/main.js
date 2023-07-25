"use strict";

import PopUp from "./popup.js";
import Field from "./field.js";
import * as sound from "./sound.js";

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

let started = false; //처음은 게임이 실행이 안 된 상태기 때문
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClcikListener(() => {
  startGame();
});

const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === "carrot") {
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (item === "bug") {
    finishGame(false);
    console.log(bug);
  }
}

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  started = true;
  sound.PlayBackground();
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showWithText("Replay❓");
  sound.StopBackground();
  sound.PlayAlert();
}

function finishGame(win) {
  started = false;
  sound.StopBackground();
  if (win) {
    sound.PlayWin();
  } else {
    sound.PlayBug();
  }
  stopGameTimer();
  gameFinishBanner.showWithText(win ? "YOU WON :) " : "YOU LOST :( ");
}

function stopGameTimer() {
  clearInterval(timer);
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimeText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimeText(--remainingTimeSec);
  }, 1000);
}

function updateTimeText(time) {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  gameTimer.innerText = `${minute}:${second}`;
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fa-solid");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function showGameButton() {
  gameBtn.style.visibility = "visible";
}

// 게임이 작동되는 함수
function initGame() {
  score = 0;
  gameScore.innerText = CARROT_COUNT;
  gameField.init();
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}
