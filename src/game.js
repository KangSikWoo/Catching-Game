"use strict";

import Field from "./field.js";
import * as sound from "./sound.js";

// 타입 보장
export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

// 외부에서 건들이면 안되는 생성자들을 이용하는 방법
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    // duration 반환
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}
class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false; //처음은 게임이 실행이 안 된 상태기 때문
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListner(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    sound.PlayBackground();
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.StopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === "bug") {
      this.stop(Reason.lose);
    }
  };

  stopGameTimer() {
    clearInterval(this.timer);
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimeText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.cancel);
        return;
      }
      this.updateTimeText(--remainingTimeSec);
    }, 1000);
  }

  updateTimeText(time) {
    const minute = Math.floor(time / 60);
    const second = time % 60;
    this.gameTimer.innerText = `${minute}:${second}`;
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector(".fa-solid");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showGameButton() {
    this.gameBtn.style.visibility = "visible";
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  // 게임 초기화
  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
}
