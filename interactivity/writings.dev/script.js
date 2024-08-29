class CategorySlider {
  static categories = [
    "JavaScript",
    "DevOps",
    "Cloud",
    "Terraform",
    "Architecture",
    "Scalability",
    "Explainers",
  ];

  constructor(containerClass) {
    this._containerClass = containerClass;
    document.querySelector(containerClass).addEventListener("mousedown", this.onMouseDown.bind(this));
    document.querySelector(containerClass).ondragstart = () => false;
  }

  onMouseDown(event) {
    const container = document.querySelector(this._containerClass);
    const startX = event.pageX - container.offsetLeft;
    const startScroll = container.scrollLeft;

    function moveScroll(event) {
      const x = event.pageX - container.offsetLeft;
      const walkX = (x - startX);
      container.scrollLeft = startScroll - walkX;
    }

    document.addEventListener("mousemove", moveScroll);

    container.onmouseup = function () {
      document.removeEventListener("mousemove", moveScroll);
      container.onmouseup = null;
      container.onmouseleave = null;
    }

    container.onmouseleave = function (event) {
      if (event.target.matches(".categories>p")) return;

      document.removeEventListener("mousemove", moveScroll);
      container.onmouseleave = null;
      container.onmouseup = null;
    }
  }
}

class Articles {

  static content = [];

  constructor(containerClass, cardsPerPage = 9) {

    this._containerClass = containerClass;
    this._cardsPerPage = cardsPerPage;
    this._currentPage = 0;
    document.addEventListener("selectPage", this.selectPage.bind(this));
    document.addEventListener("contentLoaded", this.onLoad.bind(this));
    document.querySelector(this._containerClass).addEventListener("click", this.cardClicked.bind(this));

  }

  onLoad() {
    this.populatePage();
  }

  cardClicked(event) {
    let card = event.target.closest("div.card");

    if (!card) return;

    if (!card.classList.contains("selected")) {
      
      const left = (document.documentElement.clientWidth / 2) - (card.offsetWidth / 2);
      const top = (document.documentElement.clientHeight / 2) + (card.offsetHeight / 2);
      
      card.classList.add("selected");

      card.style.left = left + 'px';
      card.style.top = top + 'px';

    } else {
      card.style.left = "";
      card.style.top = "";
      card.classList.remove("selected");
    }

  }

  addCard(cardObject) {
    let card = document.createElement('div')
    card.className = "card"
    card.innerHTML = `
    <div class="card-content">
      <img src="images/${cardObject.img}">
      <h3>${cardObject.title}</h3>
      <p>${cardObject.content}</p>
      <div class="card-footer">
        <p>${cardObject.date}</p>
        <p>•</p>
        <p>${cardObject.category}</p>
      </div>
    </div>
    `;

    document.querySelector(this._containerClass).append(card);
  }

  populatePage(start = 0, end = this._cardsPerPage) {
    let container = document.querySelector(this._containerClass);

    // container.innerHTML = "";

    for (let card of Articles.content.slice(start, end)) {
      this.addCard(card);
    }
  }

  selectPage(event) {
    if (event.detail.pageIndex === this._currentPage) return;

    let start = event.detail.pageIndex * this._cardsPerPage;
    let end = start + this._cardsPerPage;

    this.populatePage(start, end);

    this._currentPage = event.detail.pageIndex;
  }

}

class Pagination {
  constructor(containerClass, cardsPerPage = 9) {
    this._containerClass = containerClass;
    this._cardsPerPage = cardsPerPage;

    let container = document.querySelector(this._containerClass)

    container.addEventListener("click", this.select.bind(this));
    document.addEventListener("contentLoaded", this.onLoad.bind(this));

    /**
     * Load content from json file (simulating API request)
     * Once loaded, trigger event to create cards
     */
    fetch("./content.json")
      .then(response => response.json())
      .then(data => {
        Articles.content = data;

        let event = new CustomEvent("contentLoaded");
        document.dispatchEvent(event);
      });
  }

  /**
   * @returns Index in array of page number buttons
   */
  get pageIndex() {
    return Array.from(this._pages).indexOf(this._current);
  }

  onLoad() {
    let container = document.querySelector(this._containerClass);

    this._numPages = Math.ceil(Articles.content.length / this._cardsPerPage);

    console.log(this._numPages)

    this.createButtons();

    this._pages = container.querySelectorAll("li");
    this._current = this._pages[0]
    this._current.classList.add("current-page");
  }

  createButtons() {
    let container = document.querySelector(this._containerClass);

    let previous = document.createElement("div");
    previous.setAttribute("previous", "")
    previous.classList.add("pagination-button")
    previous.textContent = "Previous";

    container.append(previous);

    for (let i = 1; i <= this._numPages; i++) {
      let li = document.createElement("li")
      li.classList.add("pagination-button")
      li.innerHTML = `<p>${i}</p>`
      container.append(li);
    }

    let next = document.createElement("div");
    next.setAttribute("next", "")
    next.classList.add("pagination-button")
    next.textContent = "Next";

    container.append(next);
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

    let pageEvent = new CustomEvent("selectPage", { detail: { pageIndex: this.pageIndex } });
    document.dispatchEvent(pageEvent);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let ar = new Articles(".cards-container");
  let pg = new Pagination(".pagination", 9);
  let ct = new CategorySlider(".categories");
})
