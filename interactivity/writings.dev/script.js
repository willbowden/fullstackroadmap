class Pagination {
  constructor(pages, container) {
    this._container = container;
    this._container.onclick = this.select.bind(this);
    this._current = document.querySelector(".current-page");
    this._pages = container.querySelectorAll("li")
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

    this._current.classList.remove("current-page");

    if (elem.hasAttribute("previous")) {
      elem = this._pages[((this.pageIndex - 1 % this._pages.length) + this._pages.length) % this._pages.length]
    } else if (elem.hasAttribute("next")) {
      elem = this._pages[((this.pageIndex + 1 % this._pages.length) + this._pages.length) % this._pages.length]
    }

    elem.classList.add("current-page")

    this._current = elem;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let pg = new Pagination(5, document.querySelector(".pagination"));
})
