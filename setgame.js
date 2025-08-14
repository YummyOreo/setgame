const Color = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue'
};

const Shape = {
    DIAMOND: 0,
    SQUIGLE: 1,
    OVAL: 2,
}

const Fill = {
    OPEN: 0,
    LINED: 1,
    FILLED: 2
}

class Card {
  constructor(shape, color, number, fill) {
    this.shape = shape;
    this.color = color;
    this.number = number;
    this.fill = fill;
  }

  display() {
    let el = document.createElement("p");
    el.classList.add(this.color);
    el.classList.add(this.fill);
    let text = ""
    if (this.shape == Shape.DIAMOND) {
        text = "D";
    } else if (this.shape == Shape.OVAL) {
        text = "O";
    } else {
        text = "S";
    }

    text = text * this.number;
    el.textContent = text;
    return el;
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
        new Card(shape, Color.GREEn, 3, fill)
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

generateCards();
randomizeCards();

document.querySelector("#first .first").appendChild(cards[0].display());