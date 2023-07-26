"use strict";

import PopUp from "./popup.js";
import Game from "./game.js";

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const gameFinishBanner = new PopUp();

const game = new Game(20, 20, 20);
// 게임이 왜 멈췄는지를 알려줌. game.js의 onGameStop이 실행됨.
// pop up 배너를 띄우기 위함.
game.setGameStopListner((reason) => {
  console.log(reason);
  let message;
  switch (reason) {
    case "cancel":
      message = "Replay❓";
      break;
    case "win":
      message = "YOU WON :) ";
      break;
    case "lose":
      message = "YOU LOST :( ";
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClcikListener(() => {
  game.start();
});
