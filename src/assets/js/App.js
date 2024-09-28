import fetchJson from '../utils/fetch-json';
import Card from '@/Components/Card/Card.js';
import cardsStyle from '@/assets/css/cards.module.sass';
import PopupForm from "../../Components/PopupForm/PopupForm.js";

const ROWS_DESKTOP = 3;
const COLUMNS_DESKTOP = 8;
export default class App {
  static instance;
  characters = [];
  cards = {};
  selectedIndex;
  isBusy = false;
  totalScore;
  pl1 = {name: 'Игрок 1', score: 0};
  pl2 = {name: 'Игрок 2', score: 0};
  players = [];
  activePlayerIndex = 0;

  constructor(element) {
    if (App.instance) {
      this.destroy();
    }
    App.instance = this;

    this.el = element;
    this.startGame();
    this._initEvents();

    //TODO: to place it in el
    this.score1 = document.getElementById('js-score_1');
    this.score2 = document.getElementById('js-score_2');
    this.name1 = document.getElementById('js-name_1');
    this.name2 = document.getElementById('js-name_2');

  }

  _initEvents() {
    document.addEventListener('cardClicked', e => {
      if (this.isBusy) {
        return;
      }
      const index = e.detail.index;
      const key = e.detail.key;
      this.cards[index][key].selectCard();
      if (this.selectedIndex && this.selectedIndex === index) {
        this.isBusy = true;
        window.setTimeout(() => {
          for (const _key of Object.keys(this.cards[index])) {
            this.cards[index][_key].doEmpty();
          }
          this.selectedIndex = null;
          this.selectedKey = null;
          this.isBusy = false;
          this._increaseScore();
          if (++this.totalScore === Math.floor(ROWS_DESKTOP*COLUMNS_DESKTOP)/2) {
            this.finishGame();
          }
        }, 1500);
      } else if (this.selectedIndex && this.selectedIndex !== index) {
        this.isBusy = true;
        window.setTimeout(() => {
          this.cards[index][key].unSelectCard();
          this.cards[this.selectedIndex][this.selectedKey].unSelectCard();
          this.selectedIndex = null;
          this.selectedKey = null;
          this.isBusy = false;
          this._changePlayer();
        }, 1000);
      } else {
        this.selectedIndex = index;
        this.selectedKey = key;
      }
    });

    document.addEventListener('GAME/nextUser', e => {
      this._changePlayer();
    });
    document.addEventListener('GAME/updateNames', e => {
      this.name1.innerHTML = e.detail.name1 || this.pl1.name;
      this.name2.innerHTML = e.detail.name2 || this.pl2.name;

      if (e.detail.name1) {
        this.pl1.name = e.detail.name1;
      }
      if (e.detail.name2) {
        this.pl2.name = e.detail.name2;
      }


    });
  }

  _increaseScore() {
    this.score1.innerHTML = (++this.players[this.activePlayerIndex].score).toString();
  }

  _changePlayer() {
    this.activePlayerIndex = (this.players.length - 1) === this.activePlayerIndex ? 0 : this.activePlayerIndex + 1;
    debugger
    alert(`Сейчас ходит ${this.players[this.activePlayerIndex].name}`)
  }


  finishGame() {
alert('game finished');
  }

  startGame() {
    const renderedPopup = new PopupForm(this._start.bind(this));
    document.body.append(renderedPopup.element);

  }

  async _start() {
    this.players = [this.pl1, this.pl2];
    this.characters = await this._getApiCharacters();
    this._renderCards();
  }

  async _getApiCharacters() {
    let result = [];
    try {
      result = await fetchJson(`${process.env.BACKEND_URL}en/characters`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('something went wrong', error);
    }

    return result;
  }

  _getRandomIndexes(characters) {
    let arr = characters ? characters : [];

    if (!characters) {
      arr = Array(characters?.length || this.characters.length)
        .fill()
        .map((_, i) => i++);
    }

    if (!arr.length) {
      return [Math.floor(Math.random() * characters?.length || this.characters.length)];
    }

    arr.sort(() => 0.5 - Math.random());
    return arr;
  }

  _renderCards() {
    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add(cardsStyle.cards);

    let rows;
    let columns;

    if (window.matchMedia('(min-width: 768.1px)').matches) {
      rows = ROWS_DESKTOP;
      columns = COLUMNS_DESKTOP;
    } else {
      rows = 6;
      columns = 3;
    }

    cardsWrapper.style.setProperty("--cards-columns", columns);
    cardsWrapper.style.setProperty("--cards-rows", rows);

    const maxCards = rows * columns;
    const randomIndexes = this._getRandomIndexes().splice(0, maxCards / 2);

    const resultIndexes = [...randomIndexes, ...randomIndexes];

    let key = 0;
    for (const index of this._getRandomIndexes(resultIndexes)) {
      if (this.characters[index]) {
        if (
          typeof this.cards[index.toString()] !== 'object' ||
          typeof this.cards[index.toString()] === null
        ) {
          this.cards[index.toString()] = {};
        }
        this.cards[index.toString()][key.toString()] = new Card(
          this.characters[index],
          cardsWrapper,
          index,
          key
        );

        key++;
      }
    }
    this.el.append(cardsWrapper);
  }

  _remove() {
    this.el.remove();
  }

  destroy() {
    for (const obj of Object.keys(this.cards)) {
      Object.keys(obj).forEach(item => obj[item].destroy());
    }

    this._remove();
  }
}
