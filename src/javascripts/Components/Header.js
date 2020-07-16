import Element from './Element.js';

export default class Header extends Element {
  constructor() {
    super();

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('header');

    return wrapper;
  }

  getMenu() {
    const menu = document.createElement('div');
    menu.className = 'menu';

    const menu_button = document.createElement('button');
    menu_button.innerText = 'menu';
    menu.appendChild(menu_button);

    return menu;
  }

  getLogo() {
    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.innerText = 'Todo List';

    return logo;
  }

  setElement() {
    const wrapper = this.getWrapper();

    wrapper.appendChild(this.getLogo());
    wrapper.appendChild(this.getMenu());

    this.element = wrapper;
  }
}
