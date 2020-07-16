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
let targetRemove = undefined;
let targetData = undefined;
let columnsMap = new Map();

export default class Kanban extends Element {
  constructor(data) {
    super();

    this.key = data.key;
    this.columns = [];

    data.columns.forEach((column) => {
      const columnObject = {
        key: column.key,
        data: column,
        dom: new Column(column),
      };
      this.columns.push(columnObject);
      columnsMap.set(column.key, columnObject);
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
    wrapper.dataset.key = this.key;

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

  _mousemove(event) {
    if (!this.clicked) return;

    // pageX, pageY 는 모든 페이지 기반
    // clientX, clientY 는 현제 보이는 화면 기반
    const { pageX, pageY } = event;

    // 잠시 현재 hover element를 가리고 현재 좌표의 element를 가져온다
    hover.element.hidden = true;
    const elemBelow = document.elementFromPoint(pageX, pageY);
    const li = elemBelow.closest('li');
    hover.element.hidden = false;

    hover.tracking(pageX, pageY);

    if (!li || !this.li) {
      return;
    }

    if (isBefore(this.li, li) && li.className !== 'start_point') {
      li.parentNode.insertBefore(this.li, li);
    } else if (li.parentNode) {
      li.parentNode.insertBefore(this.li, li.nextSibling);
    }

    // delete hover target
    if (targetRemove) {
      const { key } = targetRemove.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(key)).dom;

      targetData = columnObject.pickNote(targetRemove.dataset.key);

      targetRemove.remove();
      targetRemove = undefined;
    }
  }

  _mousedown(event) {
    this.clicked = true;
    targetRemove = event.target.closest('li');

    if (!targetRemove || targetRemove.className === 'start_point') {
      return;
    }

    this.li = targetRemove.cloneNode(true);
    this.li.classList.add('temp_space');

    hover.changeInnerDom(
      targetRemove.cloneNode(true),
      event.pageX,
      event.pageY,
    );
  }

  _mouseup() {
    this.clicked = false;
    if (this.li && this.li.closest('.column')) {
      this.li.classList.remove('temp_space');

      const { key } = this.li.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(key)).dom;
      const ul = columnObject.element.querySelector('ul');

      let index = -1;
      Array.from(ul.children).forEach((cur, idx) => {
        if (parseInt(cur.dataset.key) === targetData.key) {
          index = idx;
        }
      });

      columnObject.pushNote(targetData, index - 1);

      targetData = undefined;
      this.li = undefined;
    }
    hover.clearInnerDom();
  }

  _mouseleave() {
    if (!this.clicked) {
      return;
    }
    if (this.li) {
      this.li.classList.remove('temp_space');

      const { key } = this.li.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(key)).dom;
      const ul = columnObject.element.querySelector('ul');

      let index = -1;
      Array.from(ul.children).forEach((cur, idx) => {
        if (parseInt(cur.dataset.key) === targetData.key) {
          index = idx;
        }
      });

      columnObject.pushNote(targetData, index - 1);

      targetData = undefined;
      this.li = undefined;
    }
    hover.clearInnerDom();
  }

  setEventListeners() {
    this.element.addEventListener('mousemove', this._mousemove);
    this.element.addEventListener('mousedown', this._mousedown);
    this.element.addEventListener('mouseup', this._mouseup);
    this.element.addEventListener('mouseleave', this._mouseleave);
  }
}
