class WordGuess {
  constructor(letters, display, nGuesses) {
    this.dictionary = ['apple', 'bumble', 'crispy', 'drop', 'edge', 'fuzzy'];
    this.secretWord = this.selectSecret();
    this.wrongGuesses = [];
    this.Guesses = [];
    this.nGuesses = nGuesses;
    this.letters = letters;
    this.display = display;
    this.modalOverlay = document.querySelector('.modalOverlay');
    this.modal = document.querySelector('#modal');
    this.modalTitle = modal.querySelector('h1');
    this.playAgain = modal.querySelector('#again');
    this.quit = modal.querySelector('#quit');

    this.bindEvents();
    this.displayBlanks(this.secretWord);
  }

  bindEvents() {
    document.addEventListener('keyup', this.makeGuess.bind(this))
    this.letters.addEventListener('click', this.makeGuess.bind(this));
    this.playAgain.addEventListener('click', this.continue.bind(this));
    this.quit.addEventListener('click', this.quitGame.bind(this));
  }

  selectSecret() {
    let length = this.dictionary.length;
    let index = Math.floor(Math.random() * length);
    return this.dictionary.splice(index, 1)[0];
  }

  displayBlanks() {
    let numBlanks = this.secretWord.length;
    let blankWord = "";

    for (let i = 0; i < numBlanks; i++) {
      blankWord += "_"
    }

    this.display.textContent = blankWord;
  }

  makeGuess() {
    event.preventDefault();
    let listItem;
    let letterGuessed;

    if (event.type === "click") {
      listItem = event.target.closest('li');
      if (listItem === null) { return };
      letterGuessed = listItem.textContent;
    } else if (event.type === "keyup") {
      letterGuessed = event.key;
      listItem = document.querySelector(`#${letterGuessed}`);
    }

    listItem.classList.add('guessed');

    let wordArray = this.secretWord.split('');

    if (wordArray.includes(letterGuessed)) {
      this.resolveCorrectGuess(wordArray, letterGuessed);
    } else {
      this.resolveWrongGuess(letterGuessed);
    }
  }

  resolveCorrectGuess(wordArray, letterGuessed) {
    let newDisplayArray = this.display.textContent.split('');

    wordArray.forEach((char, index) => {
      if (char === letterGuessed) {
        newDisplayArray.splice(index, 1, letterGuessed);
      }
    })
    this.display.textContent = newDisplayArray.join('');

    this.checkWin();
  }

  checkWin() {
    if (!this.display.textContent.split('').includes('_')) {
      this.displayModal("won");
    }
  }

  resolveWrongGuess(letterGuessed) {
    this.wrongGuesses.push(letterGuessed);
    this.nGuesses.textContent = `Wrong Guesses: ${this.wrongGuesses.length}`;
    let apple = document.querySelector(`#apple${this.wrongGuesses.length}`);
    apple.classList.add('falling');
    this.checkLoss();
  }

  checkLoss() {
    if (this.wrongGuesses.length >= 6) {
      this.displayModal("lost");
    }
  }

  displayModal(gameState) {
    this.modalOverlay.classList.remove('hidden');
    this.modal.classList.remove('hidden');
    switch (gameState) {
      case 'won':
        this.modalTitle.textContent = this.modalTitle.dataset.won;
        this.playAgain.classList.remove('hidden');
        this.quit.classList.remove('hidden');
        break;
      case 'lost':
        this.modalTitle.textContent = this.modalTitle.dataset.lost;
        this.playAgain.classList.remove('hidden');
        this.quit.classList.remove('hidden');
        break;
      case 'gameover':
        this.modalTitle.textContent = this.modalTitle.dataset.gameover;
        this.playAgain.classList.add('hidden');
        this.quit.classList.add('hidden');
        break;
      case 'out':
        this.modalTitle.textContent = this.modalTitle.dataset.out;
        this.playAgain.classList.add('hidden');
        this.quit.classList.add('hidden');
        break;
    }
  }

  continue() {
    event.preventDefault();

    if (this.dictionary.length <= 0) {
      this.displayModal('out');
      return;
    }

    this.secretWord = this.selectSecret();
    this.displayBlanks();
    this.wrongGuesses = [];
    this.Guesses = [];

    this.nGuesses.textContent = `Wrong Guesses: ${this.wrongGuesses.length}`

    let letters = this.letters.children;

    for (let i = 0; i < letters.length; i ++) {
      letters[i].classList.remove('guessed');
    }

    let apples = document.querySelectorAll('.apple');

    apples.forEach((apple) => apple.classList.remove('falling'));

    this.modalOverlay.classList.add('hidden');
    this.modal.classList.add('hidden');
  }

  quitGame() {
    this.displayModal('gameover');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let letters = document.querySelector('.alphabet');
  let display = document.querySelector('#secretword');
  let nGuesses = document.querySelector('.guess');

  let game = new WordGuess(letters, display, nGuesses);
})
