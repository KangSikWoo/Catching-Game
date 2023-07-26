"use strict";

import PopUp from "./popup.js";
import * as sound from "./sound.js";
import { GameBuilder, Reason } from "./game.js";

const gameFinishBanner = new PopUp();

// 이렇게 작성하는 것이 더 한 눈에 들어오고 이해하기도 쉬움.
const game = new GameBuilder()
  .gameDuration(20)
  .carrotCount(20)
  .bugCount(20)
  .build();

// 게임이 왜 멈췄는지를 알려줌. game.js의 onGameStop이 실행됨.
// 상황에 맞게 pop up 배너를 띄우기 위함.
game.setGameStopListner((reason) => {
  console.log(reason);
  let message;
  switch (reason) {
    case Reason.cancel:
      message = "Replay❓";
      sound.PlayAlert();
      break;
    case Reason.win:
      message = "YOU WON :) ";
      sound.PlayCarrot();
      break;
    case Reason.lose:
      message = "YOU LOST :( ";
      sound.PlayBug();
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

// 배너를 클릭하면 재시작
gameFinishBanner.setClcikListener(() => {
  game.start();
});
