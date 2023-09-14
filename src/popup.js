"use strict";

export default class PopUp {
  constructor() {
    this.popUpText = document.querySelector(".pop-up__message");
    this.popUp = document.querySelector(".pop-up");
    this.popUpRefresh = document.querySelector(".pop-up__refresh");

    this.popUpRefresh.addEventListener("click", () => {
      this.onclick && this.onclick();
      this.hide();
    });
  }

  setClickListener(onclick) {
    this.onclick = onclick;
  }

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove("pop-up--hide");
  }

  showButton(reason) {
    if (reason === "win") {
      this.popUpRefresh.innerHTML = `
        <i class="fa-solid fa-play"></i>
      `;
    } else if (reason === "clear") {
      this.popUpRefresh.remove();
    } else {
      this.popUpRefresh.innerHTML = `
        <i class="fa-solid fa-rotate-right"></i>
      `;
    }
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
  }
}
