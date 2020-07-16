import Element from './Element.js';
import Note from './Note.js';

export default class Column extends Element {
  constructor(data) {
    super();

    this.notes = [];

    this.key = data.key;
    this.title = data.title;
    data.notes.forEach((note) => {
      this.notes.push({
        key: note.key,
        data: note,
        dom: new Note(note),
      });
    });

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.dataset.key = this.key;
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
    const li = document.createElement('li');
    li.className = 'start_point';
    ul.appendChild(li);
    this.notes.forEach((note) => {
      ul.appendChild(note.dom.render());
    });
  }

  pickNote(noteKey) {
    const targetIndex = this.notes.findIndex((cur) => {
      return cur.key === parseInt(noteKey);
    });
    if (targetIndex === -1) {
      return;
    }

    const target = this.notes[targetIndex];
    this.notes.splice(targetIndex, 1);
    this.updateCount();

    return target;
  }

  pushNote(note, index) {
    this.notes.splice(index, 0, note);
    this.updateCount();
  }

  updateCount() {
    const count = this.element.querySelector('.count');
    count.innerText = this.notes.length;

    console.log(this.notes);
  }

  setElement() {
    const wrapper = this.getWrapper();

    wrapper.appendChild(this.getHeader());
    wrapper.appendChild(this.getUl());

    this.element = wrapper;
  }
}
