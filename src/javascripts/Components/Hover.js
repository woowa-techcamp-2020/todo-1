import Element from './Element.js';

export default class Hover extends Element {
  constructor() {
    super();
    this.target = undefined;
    this.setElement();
  }

  changeInnerDom(dom) {
    this.target = dom;
    this.element.appendChild(this.target);
  }

  clearInnerDom() {
    if (this.target) {
      this.element.removeChild(this.target);
    }
    this.target = undefined;
  }

  tracking(x, y) {
    this.element.style.left = x - this.element.offsetWidth / 2 + 'px';
    this.element.style.top = y - this.element.offsetHeight / 2 + 'px';
  }

  consoleLog() {
    console.log('hello');
  }

  setElement() {
    const hover = document.createElement('div');
    hover.className = 'hover';
    hover.style.position = 'absolute';
    hover.style.zIndex = 1000;
    hover.style.width = 400 + 'px';

    this.element = hover;
  }
}
