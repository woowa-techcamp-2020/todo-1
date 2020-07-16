import Element from './Element.js';
import Column from './Column.js';
import Hover from './Hover.js';

function isBefore(element1, element2) {
  let cur;
  if (element2.parentNode === element1.parentNode) {
    for (cur = element1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === element2) return true;
    }
  }
  return false;
}

let hover = undefined;

export default class Kanban extends Element {
  constructor(kanban) {
    super();

    this.columns = [];
    kanban.columns.forEach((column) => {
      this.columns.push({
        data: column,
        dom: new Column(column),
      });
    });

    this.hover = new Hover();
    this.li = undefined;
    hover = this.hover;

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'kanban';
    wrapper.id = 'mytodo';

    return wrapper;
  }

  addColumn(wrapper) {
    this.columns.forEach((column) => {
      wrapper.appendChild(column.dom.render());
    });
  }

  setElement() {
    const wrapper = this.getWrapper();
    this.addColumn(wrapper);
    wrapper.appendChild(this.hover.render());

    this.element = wrapper;
  }

  _trackCurser(event) {
    if (!this.clicked) return;

    // pageX, pageY 는 모든 페이지 기반
    // clientX, clientY 는 현제 보이는 화면 기반
    const { pageX, pageY } = event;
    hover.element.hidden = true;
    const elemBelow = document.elementFromPoint(pageX, pageY);
    const li = elemBelow.closest('li');
    hover.element.hidden = false;

    hover.tracking(pageX, pageY);

    if (li === null || this.li === undefined) {
      return;
    }

    const { className } = li;

    if (isBefore(this.li, li) && className !== 'start_point') {
      li.parentNode.insertBefore(this.li, li);
    } else {
      li.parentNode.insertBefore(this.li, li.nextSibling);
    }
  }

  _mousedown(event) {
    this.clicked = true;
    const target = event.target.closest('li');
    if (!target) {
      return;
    }
    if (target.className === 'start_point') {
      return;
    }

    this.li = target.cloneNode(true);
    this.li.classList.add('temp_space');
    hover.changeInnerDom(target.cloneNode(true), event.pageX, event.pageY);
    target.remove();
  }

  _mouseup() {
    this.clicked = false;
    if (this.li) {
      this.li.classList.remove('temp_space');
      this.li = undefined;
    }
    hover.clearInnerDom();
  }

  setEventListeners() {
    this.element.addEventListener('mousemove', this._trackCurser, false);
    this.element.addEventListener('mousedown', this._mousedown);
    this.element.addEventListener('mouseup', this._mouseup);
  }
}
