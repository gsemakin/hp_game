import fetchJson from '../utils/fetch-json';
import Card from '@/Components/Card/Card.js';
import cardsStyle from '@/css/cards.module.sass';

export default class App {
  static instance;
  characters = [];
  cards = {};
  selectedIndex;
  isBusy = false;
  player_1;

  constructor(element) {
    if (App.instance) {
      this.destroy();
    }
    App.instance = this;

    this.el = element;
    this.startGame();
    this._initEvents();
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
        }, 1500);
      } else if (this.selectedIndex && this.selectedIndex !== index) {
        this.isBusy = true;
        window.setTimeout(() => {
          this.cards[index][key].unSelectCard();
          this.cards[this.selectedIndex][this.selectedKey].unSelectCard();
          this.selectedIndex = null;
          this.selectedKey = null;
          this.isBusy = false;
        }, 1000);
      } else {
        this.selectedIndex = index;
        this.selectedKey = key;
      }
    });
  }

  startGame() {
    this._start();
  }

  async _start() {
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
      rows = 3;
      columns = 6;
    } else {
      rows = 6;
      columns = 3;
    }

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
