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
  constructor(data, modalManager) {
    super();

    this.id = data.id;
    this.columns = [];
    data.columns.forEach((column) => {
      const columnObject = {
        id: column.id,
        data: column,
        dom: new Column(column),
      };
      this.columns.push(columnObject);
      columnsMap.set(column.id, columnObject);
    });

    this.modalManager = modalManager;
    this.hover = new Hover();
    this.li = undefined;

    hover = this.hover;

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'kanban';
    wrapper.id = 'mytodo';
    wrapper.dataset.id = this.id;

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
    const column = elemBelow.closest('.column');
    hover.element.hidden = false;

    hover.tracking(pageX, pageY);

    if (!li || !this.li) {
      if (column) {
        const ul = column.querySelector('ul');

        const start = ul.querySelector('.start_point');
        const { top } = start.getBoundingClientRect();

        if (top > pageY) {
          // insertfirst
          ul.insertBefore(this.li, start.nextSibling);
        } else {
          // insertlast
          ul.appendChild(this.li);
        }
      }
      return;
    }

    if (isBefore(this.li, li) && li.className !== 'start_point') {
      li.parentNode.insertBefore(this.li, li);
    } else if (li.parentNode) {
      li.parentNode.insertBefore(this.li, li.nextSibling);
    }

    // delete hover target
    if (targetRemove) {
      const { id } = targetRemove.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(id)).dom;

      targetData = columnObject.pickNote(targetRemove.dataset.id);

      targetRemove.remove();
      targetRemove = undefined;
    }
  }

  _mousedown(event) {
    // 왼쪽 클릭 & 터치 이벤트 인 경우에만 동작하도록 설정
    if (event.button !== 0) {
      return;
    }

    targetRemove = event.target.closest('li');

    if (!targetRemove || targetRemove.className === 'start_point') {
      return;
    }

    this.clicked = true;
    this.li = targetRemove.cloneNode(true);
    this.li.classList.add('temp_space');

    hover.changeInnerDom(targetRemove.cloneNode(true));
    hover.element.hidden = true;
  }

  _mouseup() {
    this.clicked = false;
    if (this.li && this.li.closest('.column')) {
      this.li.classList.remove('temp_space');

      const { id } = this.li.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(id)).dom;
      const ul = columnObject.element.querySelector('ul');

      let index = -1;
      Array.from(ul.children).forEach((cur, idx) => {
        if (parseInt(cur.dataset.id) === targetData.id) {
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

    this.clicked = false;
    if (this.li) {
      this.li.classList.remove('temp_space');

      const { id } = this.li.closest('.column').dataset;
      const columnObject = columnsMap.get(parseInt(id)).dom;
      const ul = columnObject.element.querySelector('ul');

      let index = -1;
      Array.from(ul.children).forEach((cur, idx) => {
        if (parseInt(cur.dataset.id) === targetData.id) {
          index = idx;
        }
      });

      columnObject.pushNote(targetData, index - 1);

      targetData = undefined;
      this.li = undefined;
    }
    hover.clearInnerDom();
  }

  _click(e) {
    // TODO: 이벤트 구현 - 노트 삭제
    // 모달 오픈
  }

  _dblclick(e) {
    // TODO: 이벤트 구현 - 컬럼 제목 수정, 노트 수정
    // double click은 한번 더블클릭 한 뒤에 바로 같은 좌표에서 더블클릭 시 또 다시 발생하지 않음
    // 모달 오픈
  }

  setEventListeners() {
    this.element.addEventListener('mousemove', (e) => {
      this._mousemove(e);
    });
    this.element.addEventListener('mousedown', (e) => {
      this._mousedown(e);
    });
    this.element.addEventListener('mouseup', (e) => {
      this._mouseup(e);
    });
    this.element.addEventListener('mouseleave', (e) => {
      this._mouseleave(e);
    });
    this.element.addEventListener('click', (e) => {
      this._click(e);
    });
    this.element.addEventListener('dblclick', (e) => {
      this._dblclick(e);
    });
  }
}
