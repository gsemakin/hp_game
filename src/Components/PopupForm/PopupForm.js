import PopupFormStyle from './PopupForm.module.sass';
import CardStyle from "../Card/Card.module.sass";

export default class PopupForm {

        element = null;
        subElements = {};


        constructor(callback) {
            this.callback = callback;
            this.render();
        }

        onDocumentClick = event => {
            let target = event.target;
            const data_personael = target.dataset.personael;
            switch (data_personael) {

                case 'cclose':
                    this.destroy();
                    break;



                case 'doaction':

                    const updateNames = new CustomEvent('GAME/updateNames', {
                        detail: {
                            name1: this.subElements.player1.value || '',
                            name2: this.subElements.player2.value || ''
                        }
                    });
                    document.dispatchEvent(updateNames);

                    this.callback();
                    this.destroy();
                    break;


                default:

                    break;


            }

        };


        get template() {
        return `
                <div class="${PopupFormStyle.popupPersona}">
                    <div class="${PopupFormStyle.popupPersona__text}">
                        <div class="${PopupFormStyle.container}">
                          <h1>Укажи имена игроков</h1>
                        
                          <div class="${PopupFormStyle.control_group}">
                            <input id="firstname1" type="text" name="firstname" placeholder="Введи своё имя" />
                        
                            <label for="firstname1">
                              <span>Никнейм Игрока 1</span>
                            </label>
                          </div>
                          
                            <div class="${PopupFormStyle.control_group}">
                            <input id="firstname2" type="text" name="firstname" placeholder="Введи своё имя" />
                        
                            <label for="firstname2">
                              <span>Никнейм Игрока 2</span>
                            </label>
                          </div>                   
                        <div class="${PopupFormStyle.popupPersona__actions_block}">                
                            <div class="${PopupFormStyle.popupPersona__btn}"><a data-personael="doaction" href="#">Играть!</a></div>          
                        </div>
                        </div>                        
                    </div>
                </div>           
            `;
    }



    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
this.subElements.player1 = this.element.querySelector('#firstname1');
this.subElements.player2 = this.element.querySelector('#firstname2');
        this.initEventListeners();
        this.createOverlay();
    }

    initEventListeners() {
        document.addEventListener('click', this.onDocumentClick, true);
    }

    remove() {

        setTimeout(() => this.element.remove(), 300);
        this.removeOverlay();
        document.removeEventListener('click', this.onDocumentClick, true);
    }

    createOverlay() {
        this.overlayEl = document.createElement('section');
        this.overlayEl.classList.add(PopupFormStyle.persona__overlay_layer_unique);
        document.body.append(this.overlayEl);
    }

    removeOverlay() {
        if (this.overlayEl) {
            this.overlayEl.remove();
        }
    }

    destroy() {
        this.remove();
    }
}
