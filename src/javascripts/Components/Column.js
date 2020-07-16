import Element from './Element.js';
import Note from './Note.js';

export default class Column extends Element {
  constructor(column) {
    super();

    this.notes = [];

    this.title = column.title;
    column.notes.forEach((note) => {
      this.notes.push({
        data: note,
        dom: new Note(note),
      });
    });

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'column';
    return wrapper;
  }

  getHeader() {
    const head = document.createElement('div');
    head.className = 'head';

    const left_dom = document.createElement('div');
    left_dom.className = 'left';
    const count = document.createElement('div');
    count.className = 'count';
    count.innerText = this.notes.length;

    const h1 = document.createElement('h1');
    h1.innerText = this.title;

    left_dom.appendChild(count);
    left_dom.appendChild(h1);

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const plus_button = document.createElement('button');
    plus_button.innerText = '+';
    const more_button = document.createElement('button');
    more_button.innerText = '...';

    buttons.appendChild(plus_button);
    buttons.appendChild(more_button);

    head.appendChild(left_dom);
    head.appendChild(buttons);

    return head;
  }

  getUl() {
    const ul = document.createElement('ul');

    this.addLi(ul);

    return ul;
  }

  addLi(ul) {
    this.notes.forEach((note) => {
      ul.appendChild(note.dom.render());
    });
  }

  updateCount() {
    const count = this.element.querySelector('.count');
    count.innerText = this.notes.length;
  }

  setElement() {
    const wrapper = this.getWrapper();

    wrapper.appendChild(this.getHeader());
    wrapper.appendChild(this.getUl());

    this.element = wrapper;
  }
}
