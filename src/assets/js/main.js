import App from '@/assets/js/App.js';
import '@/assets/css/gameSpace.sass';

const gameSpaceId = 'js_gameSpace';

document.querySelector('#app').innerHTML = `
  <header class="header">
    <div class="header__title title"><h1> Harry Potter Memo Game</h1></div>

    <div class="header__score header__score_1 score"><span id="js-name_1"></span><br><span id="js-score_1">0</span></div>
    <div class="header__score header__score_2 score"><span id="js-name_2"></span><br><span id="js-score_2">0</span></div>
    
  </header>
  <section class="root">    
    <div class="gameSpace" id="${gameSpaceId}">
    </div>
  </section>
  <footer class="footer"> GS 2024 </footer>
`;

const game = new App(document.querySelector(`#${gameSpaceId}`));
