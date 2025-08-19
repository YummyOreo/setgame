const displayTemplate = `<svg class="COLOR OPEN" width="38" height="76" viewBox="0 0 200 400" style="transition: width 0.5s, height 0.5s;"><use href="#SHAPE" mask="FILL"></use><use href="#SHAPE" fill="none" stroke-width="18"></use></svg>`

const Color = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue'
};

const Shape = {
    DIAMOND: 'diamond',
    SQUIGLE: 'squiggle',
    OVAL: 'oval',
}

const Fill = {
    OPEN: "open",
    LINED: "lined",
    FILLED: "filled"
}

class Card {
  constructor(shape, color, number, fill) {
    this.shape = shape;
    this.color = color;
    this.number = number;
    this.fill = fill;
  }

  display() {
        let el = displayTemplate + "";
        el = el.replaceAll("SHAPE", this.shape);
        el = el.replaceAll("COLOR", this.color);
      if (this.fill == Fill.OPEN) {

        el = el.replaceAll("OPEN", "open");
      } else if (this.fill == Fill.LINED) {
        el = el.replaceAll("FILL", "url(#mask-stripe)");
      }
        el = el.replaceAll("FILL", "");
        el = el.replaceAll("OPEN", "");

        el = el.repeat(this.number);
      let bigEl = document.createElement("div");
      bigEl.innerHTML = el;
        return bigEl;
  }
}

let cards = [];

function generateRed(shape, fill) {
    return [
        new Card(shape, Color.RED, 1, fill),
        new Card(shape, Color.RED, 2, fill),
        new Card(shape, Color.RED, 3, fill)
    ];
}
function generateGreen(shape, fill) {
    return [
        new Card(shape, Color.GREEN, 1, fill),
        new Card(shape, Color.GREEN, 2, fill),
        new Card(shape, Color.GREEN, 3, fill)
    ];
}
function generateBlue(shape, fill) {
    return [
        new Card(shape, Color.BLUE, 1, fill),
        new Card(shape, Color.BLUE, 2, fill),
        new Card(shape, Color.BLUE, 3, fill)
    ];
}

function generateShape(shape) {
    cards = cards.concat(generateGreen(shape, Fill.FILLED));
    cards = cards.concat(generateRed(shape, Fill.FILLED));
    cards = cards.concat(generateBlue(shape, Fill.FILLED));
    cards = cards.concat(generateGreen(shape, Fill.LINED));
    cards = cards.concat(generateRed(shape, Fill.LINED));
    cards = cards.concat(generateBlue(shape, Fill.LINED));
    cards = cards.concat(generateGreen(shape, Fill.OPEN));
    cards = cards.concat(generateRed(shape, Fill.OPEN));
    cards = cards.concat(generateBlue(shape, Fill.OPEN));
}

function generateCards() {
    generateShape(Shape.DIAMOND);
    generateShape(Shape.OVAL);
    generateShape(Shape.SQUIGLE);
}

function randomizeCards() {
        for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

const setsElement = document.querySelector(".sets")
const cardsLeft = document.querySelector(".left")


let rows = document.querySelectorAll(".row");
let index = 0;

let activeList = {};

let setsFound = 0;

var secs = 0;
var mins = 0;
var paused = false;

document.getElementById("pause").addEventListener("click", () => {
    paused = !paused;
    document.getElementById("pause").innerHTML = paused ? "resume" : "pause";
})

var stopwatch = setInterval(function(){
    if (paused || document.hidden) {return;}
    secs++;
    if (secs == 60) {
        mins++;
        secs = 0;
    }

    document.getElementById('time').innerHTML= String(mins).padStart(2, '0') + ":" + String(secs).padStart(2, '0'); ;
}, 1000);

generateCards();
randomizeCards();

function checkProperty(list) {
    const left = list[0] == list[1];
    const right = list[1] == list[2];

    console.log(left + "" + right)

    return (left && right) || (!left && !right);
}
function checkSet(list) {
    if (!checkProperty([list[0].shape, list[1].shape, list[2].shape])) {
    console.log("a")
        return false;
    }

    if (!checkProperty([list[0].color, list[1].color, list[2].color])) {
    console.log("b")
        return false;
    }

    if (!checkProperty([list[0].number, list[1].number, list[2].number])) {
    console.log("c")
        return false;
    }

    if (!checkProperty([list[0].fill, list[1].fill, list[2].fill])) {
    console.log("d")
        return false;
    }

    return true;
}

function updateStats() {
    setsElement.textContent = "Sets found: " + setsFound;
    cardsLeft.textContent = "Cards remaining: " + (cards.length - index);
}

const statusEl = document.querySelector(".status");

function updateStatus(status) {
    statusEl.innerHTML = !status ? "Not a set" : "Set found!";
}

function removeCards(keys) {
    for (let key in keys) {
        key = keys[key];
        let el = activeList[key];
        el.classList.toggle("active");
        let inner = el.children[0];
        const newEl = cards[index].display();
        newEl.setAttribute("index", index);
        inner.replaceWith(newEl);
        index++;
        delete activeList[key];
    }
    setsFound++;
    updateStats()
}

function winCheck() {
    return index == cards.length;
}

function handleClick(e) {
    if (paused || document.hidden) {return;}
    const cardOuter = this;
    const cardInner = this.children[0];
    const index = cardInner.getAttribute("index");
    cardOuter.classList.toggle("active")
    if (activeList[index] == undefined) {
        if (Object.keys(activeList).length >= 2) {
            activeList[index] = cardOuter;
            let list = Object.keys(activeList).flatMap((id) => {
                return cards[id];
            });
            let keys = Object.keys(activeList);
            if (checkSet(list)) {
                updateStatus(true);
                if (winCheck()) {
                    document.querySelector(".setgame").innerHTML = "<h2>You Win!</h2>";
                    clearInterval(stopwatch);
                }
                removeCards(keys)
            } else {
                updateStatus(false);
                for (let key in keys) {
                    key = keys[key];
                    let el = activeList[key];
                    el.classList.toggle("active");
                    delete activeList[key];
                }
            }
        } else {
            activeList[index] = cardOuter;
        }
    } else {
        delete activeList[index]
    }
}

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const columns = row.children;
    for (let b = 0; b < columns.length; b++) {
        const item = columns[b];
        const el = cards[index].display();
        el.setAttribute("index", index);
        item.append(el);
        item.addEventListener("click", handleClick)
        index = index + 1;
    }
}

updateStats();
