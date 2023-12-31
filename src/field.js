"use strict";

import * as sound from "./sound.js";

const CARROT_SIZE = 80;

export const Item = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});
export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener("click", this.onclick);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  init() {
    this.field.innerHTML = "";
    this.carrotCount = 10;
    this.bugCount = 10;
    this._addItem("carrot", this.carrotCount, "img/carrot.png");
    this._addItem("bug", this.bugCount, "img/bug.png");
  }

  levelUp(UpdateCarrotCount, UpdateBugCount) {
    this.field.innerHTML = "";
    this.carrotCount = UpdateCarrotCount;
    this.bugCount = UpdateBugCount;
    this._addItem("carrot", this.carrotCount, "img/carrot.png");
    this._addItem("bug", this.bugCount, "img/bug.png");
  }

  // _함수명은 외부에서 참조하지 못하게 하는 표시
  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");
      item.setAttribute("class", className);
      item.setAttribute("src", imgPath);
      item.style.position = "absolute";
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  onclick = (event) => {
    const target = event.target;
    if (target.matches(".carrot")) {
      target.remove();
      sound.PlayCarrot();
      this.onItemClick && this.onItemClick(Item.carrot);
    } else if (target.matches(".bug")) {
      sound.PlayBug();
      this.onItemClick && this.onItemClick(Item.bug);
    }
  };
}

//벌레와 토끼가 화면에 랜덤하게 나타날 수 있게 함.
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
