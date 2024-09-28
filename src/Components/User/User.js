export default class User {
    constructor (el) {
        this.el = el;
        this.count = 0;

        this.render();
        this.initEvents();

    }

    render() {
        this.el.innerHTML = this.count;
    }

    initEvents() {
        document.addEventListener
    }
}
