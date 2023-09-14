"use strict";

import { Field, Item } from "./field.js";
import * as sound from "./sound.js";

// 타입 보장
export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
  clear: "clear",
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

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false; //처음은 게임이 실행이 안 된 상태기 때문
    this.score = 0;
    this.timer = undefined;
    this.gameLevel = 0;
    this.state = "";

    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.state = Reason.cancel;
        this.stop(this.state);
        this.initGame();
      } else {
        this.start();
      }
    });
  }

  setGameStopListner(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    sound.PlayBackground();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    if (this.state === Reason.win) {
      this.gameLevelUp();
    } else {
      this.initGame();
    }
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
    if (item === Item.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        if (this.gameLevel === 10) {
          this.state = Reason.clear;
          this.gameClear(this.state);
          return;
        }
        this.state = Reason.win;
        this.stop(this.state);
        this.gameLevel++;
      }
    } else if (item === "bug") {
      this.state = Reason.lose;
      this.stop(this.state);
      this.gameLevel = 0;
      this.initGame();
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
    this.gameLevel = 0;
    this.carrotCount = 10;
    this.bugCount = 10;
    this.gameDuration = 10;
    this.gameScore.innerText = this.carrotCount;
    this.updateTimeText(this.gameDuration);
    this.gameField.init();
  }

  // 게임 레벨 업
  gameLevelUp() {
    this.carrotCount += 1;
    this.bugCount += 1;
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.levelUp(this.carrotCount, this.bugCount);
    if (this.gameLevel === 2) {
      this.gameDuration += 5;
    }
  }

  // 게임 클리어
  gameClear(reason) {
    this.stop(reason);
  }
}
