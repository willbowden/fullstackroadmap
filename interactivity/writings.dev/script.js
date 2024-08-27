class Pagination {
  constructor(container) {
    this._container = container;
    this._container.onclick = this.select.bind(this);
    this._current = document.querySelector(".current-page");
    this._pages = container.querySelectorAll("li");
  }

  /**
   * @returns Index in array of page number buttons
   */
  get pageIndex() {
    return Array.from(this._pages).indexOf(this._current);
  }

  select(event) {
    let elem = event.target.closest(".pagination-button");

    if (!elem) return;

    if (elem == this._current) return;

    if (elem.hasAttribute("previous")) {
      if (this._current === this._pages[0]) return;
      elem = this._pages[this.pageIndex - 1];
    } else if (elem.hasAttribute("next")) {
      if (this._current === this._pages[this._pages.length - 1]) return;
      elem = this._pages[this.pageIndex + 1];
    }

    this._current.classList.remove("current-page");

    elem.classList.add("current-page");

    this._current = elem;

    if (this._current === this._pages[0]) {
      let prev = document.querySelector("div[previous]");
      prev.classList.add("greyed-out");
    } else {
      let prev = document.querySelector("div[previous]");
      prev.classList.remove("greyed-out");
    }

    if (this._current === this._pages[this._pages.length - 1]) {
      let prev = document.querySelector("div[next]");
      prev.classList.add("greyed-out");
    } else {
      let prev = document.querySelector("div[next]");
      prev.classList.remove("greyed-out");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let pg = new Pagination(document.querySelector(".pagination"));
})
