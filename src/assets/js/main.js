import App from '@/js/App.js';
import '@/css/gameSpace.sass';

const gameSpaceId = 'js_gameSpace';

document.querySelector('#app').innerHTML = `
  <header class="header">
    <div class="header__title title"><h1> Harry Potter Memo Game</h1></div>
    <div class="header__score score">Score:<br><span class="js-score"></span></div>
    <div class="header__name name js-name"></div>
  </header>
  <section class="root">    
    <div class="gameSpace" id="${gameSpaceId}">
    </div>
  </section>
  <footer class="footer"> Footer </footer>
`;

const game = new App(document.querySelector(`#${gameSpaceId}`));
