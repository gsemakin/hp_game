import CardStyle from './Card.module.sass';

export default class Card {
  card_container;
  constructor({ fullName = null, image = null }, el, index, key) {
    this.fullName = fullName;
    this.image = image;
    this.el = el;
    this.index = index;
    this.key = key;

    this.render();
    this._initEvents();
  }

  _initEvents() {
    this.card_container.addEventListener('click', this._onClick);
    //this.card_container.removeEventListener('click', this._onClick);
  }

  _onClick(e) {
    if (e.currentTarget.classList.contains(CardStyle.selected)) {
      return;
    }
    const cardClicked = new CustomEvent('cardClicked', {
      detail: {
        key: e.currentTarget.getAttribute('data-key'),
        index: e.currentTarget.getAttribute('data-index')
      }
    });
    document.dispatchEvent(cardClicked);
  }

  selectCard() {
    this.card_container.classList.add(CardStyle.selected);
  }
  unSelectCard() {
    this.card_container.classList.remove(CardStyle.selected);
  }

  render() {
    if (!this.fullName || !this.image) {
      return null;
    }
    this.card_container = document.createElement('div');
    this.card_container.classList.add(CardStyle.card_container);
    this.card_container.setAttribute('data-index', this.index);
    this.card_container.setAttribute('data-key', this.key);

    const card = document.createElement('div');
    card.classList.add(CardStyle.card);

    const card__front = document.createElement('div');
    card__front.classList.add(CardStyle.card_front);

    const cardImg_front = document.createElement('img');
    cardImg_front.setAttribute('src', './images/card.png');
    cardImg_front.classList.add(CardStyle.image_front);

    card__front.append(cardImg_front);

    const card__back = document.createElement('div');
    card__back.classList.add(CardStyle.card_back);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add(CardStyle.title);

    const h3 = document.createElement('h3');
    h3.textContent = this.fullName;

    cardTitle.append(h3);

    const cardImg_back = document.createElement('img');
    cardImg_back.setAttribute('src', this.image);
    cardImg_back.classList.add(CardStyle.image);

    card__back.append(cardTitle);
    card__back.append(cardImg_back);

    card.append(card__front);
    card.append(card__back);

    this.card_container.append(card);

    this.el.append(this.card_container);
  }

  doEmpty() {
    this.card_container.removeEventListener('click', this._onClick);
    this.card_container.innerHTML = '';
  }

  _remove() {
    this.card_container.remove();
  }

  destroy() {
    this.card_container.removeEventListener('click', this._onClick);
    this._remove();
  }
}
