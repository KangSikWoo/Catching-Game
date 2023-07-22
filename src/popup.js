"use strict";

export default class PopUp {
  constructor() {
    this.popUpText = document.querySelector(".pop-up__message");
    this.popUp = document.querySelector(".pop-up");
    this.popUpRefresh = document.querySelector(".pop-up__refresh");
    this.gameBtn = document.querySelector(".game__button");

    this.popUpRefresh.addEventListener("click", () => {
      this.onclick && this.onclick();
      this.hide();
    });
  }

  setClcikListener(onclick) {
    this.onclick = onclick;
  }

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove("pop-up--hide");
    this.gameBtn.style.visibility = "hidden";
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
  }
}
