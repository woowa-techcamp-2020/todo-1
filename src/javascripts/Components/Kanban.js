import Element from './Element.js';
import Column from './Column.js';
import Hover from './Hover.js';

import Store from '../Store/Store.js';

/**
 * element2가 element1 앞에 존재하는지 확인
 * @param {Element} element1 target element
 * @param {Element} element2 검사를 시작하는 element
 */
function isBefore(element1, element2) {
  let cur;
  if (element2.parentNode === element1.parentNode) {
    for (cur = element1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === element2) return true;
    }
  }
  return false;
}

export default class Kanban extends Element {
  constructor(data) {
    super();

    this.id = data.id;
    this.columns = [];
    this.columnsMap = new Map();
    data.columns.forEach((column) => {
      const columnObject = new Column(column);
      this.columns.push(columnObject);
      this.columnsMap.set(column.id, columnObject);
    });

    this.beforeColumnTitle = undefined;
    this.beforeColumnId = undefined;
    this.hover = new Hover();
    this.li = undefined;
    this.targetRemove = undefined;
    this.targetData = undefined;

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
      wrapper.appendChild(column.render());
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
    this.hover.element.hidden = true;
    const elemBelow = document.elementFromPoint(pageX, pageY);
    const li = elemBelow.closest('li');
    const column = elemBelow.closest('.column');
    this.hover.element.hidden = false;

    this.hover.tracking(pageX, pageY);

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
    if (this.targetRemove) {
      const { id } = this.targetRemove.closest('.column').dataset;
      const columnObject = this.columnsMap.get(parseInt(id));

      this.targetData = columnObject.pickNote(this.targetRemove.dataset.id);

      this.targetRemove.remove();
      this.targetRemove = undefined;
    }
  }

  _mousedown(event) {
    // 왼쪽 클릭 & 터치 이벤트 인 경우에만 동작하도록 설정
    if (event.button !== 0) {
      return;
    }

    this.targetRemove = event.target.closest('li');
    if (!this.targetRemove || this.targetRemove.className === 'start_point') {
      return;
    }
    const { id: columnId } = this.targetRemove.closest('.column').dataset;
    const columnObject = this.columnsMap.get(parseInt(columnId));

    this.clicked = true;
    this.li = this.targetRemove.cloneNode(true);
    this.beforeColumnId = columnObject.id;
    this.beforeColumnTitle = columnObject.title;

    this.li.classList.add('temp_space');

    this.hover.changeInnerDom(this.targetRemove.cloneNode(true));
    this.hover.element.hidden = true;
  }

  _mouseup() {
    this.clicked = false;

    if (this.li && this.li.closest('.column')) {
      this.li.classList.remove('temp_space');

      const { id: columnId } = this.li.closest('.column').dataset;
      const columnObject = this.columnsMap.get(parseInt(columnId));
      const ul = columnObject.element.querySelector('ul');

      const prevNote = this.li.previousSibling;
      const nextNote = this.li.nextSibling;

      const beforeNoteId =
        prevNote && prevNote.dataset.id ? prevNote.dataset.id : null;
      const afterNoteId =
        nextNote && nextNote.dataset.id ? nextNote.dataset.id : null;

      const body = {
        beforeNoteId,
        afterNoteId,
        columnId,
        userName: Store.user.name,
        noteTitle: this.targetData.content,
        columnTitle: this.beforeColumnTitle,
        columnToTitle: columnObject.title,
      };

      fetch(`/api/note/move/${this.li.dataset.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            let index = -1;
            Array.from(ul.children).forEach((cur, idx) => {
              if (parseInt(cur.dataset.id) === this.targetData.id) {
                index = idx;
              }
            });

            columnObject.pushNote(this.targetData, index - 1);
          }
          this.targetData = undefined;
          this.li = undefined;
          this.beforeColumnId = undefined;
          this.beforeColumnTitle = undefined;
        });
    }
    this.hover.clearInnerDom();
  }

  _mouseleave() {
    if (!this.clicked) {
      return;
    }
    this._mouseup();
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
  }
}
