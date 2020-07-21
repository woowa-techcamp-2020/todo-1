import Element from '../Element.js';

const Display = {
  true: 'block',
  false: 'none',
};

export default class Modal extends Element {
  constructor() {
    super();
  }

  show() {
    this.element.parentNode.style.display = Display.true;
    this.element.style.display = Display.true;
  }

  hide() {
    this.element.parentNode.style.display = Display.false;
    this.element.style.display = Display.false;
  }

  getHeader(titleText) {
    const header = document.createElement('div');
    header.className = 'header';

    const title = document.createElement('div');
    title.className = 'title';
    title.innerText = titleText;

    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close';
    closeButton.innerText = 'X';

    header.appendChild(title);
    header.appendChild(closeButton);

    return header;
  }
}
