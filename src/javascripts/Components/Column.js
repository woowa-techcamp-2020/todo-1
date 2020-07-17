import Element from './Element.js';
import Note from './Note.js';

export default class Column extends Element {
  constructor(data) {
    super();

    this.notes = [];
    this.key = data.key;
    this.title = data.title;
    this.head = undefined;
    this.ul = undefined;

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

    this.addButton = plus_button;

    this.head = head;
    return head;
  }

  getUl() {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.className = 'start_point';
    ul.appendChild(li);

    this.notes.forEach((note) => {
      ul.appendChild(note.dom.render());
    });

    this.ul = ul;
    return ul;
  }

  getCreateForm() {
    const form = document.createElement('form');
    form.classList.add('disable');
    form.classList.add('hidden');

    const textArea = document.createElement('textarea');
    textArea.maxLength = 50;

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const createButton = document.createElement('button');
    createButton.type = 'button';
    createButton.className = 'create';
    createButton.innerText = '생성';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel';
    cancelButton.innerText = '취소';

    buttons.appendChild(createButton);
    buttons.appendChild(cancelButton);

    form.appendChild(textArea);
    form.appendChild(buttons);

    this.form = form;
    this.textArea = textArea;
    this.createButton = createButton;
    this.cancelButton = cancelButton;
    return form;
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

  appendNote(data) {
    const noteObject = {
      key: data.key,
      data: data,
      dom: new Note(data),
    };
    this.pushNote(noteObject, 0);
    this.ul.insertBefore(
      noteObject.dom.render(),
      this.ul.firstChild.nextSibling,
    );
  }

  setElement() {
    const wrapper = this.getWrapper();

    wrapper.appendChild(this.getHeader());
    wrapper.appendChild(this.getCreateForm());
    wrapper.appendChild(this.getUl());

    this.element = wrapper;
  }

  setEventListeners() {
    this.addButton.addEventListener('click', () => {
      this.form.classList.remove('hidden');
    });
    this.cancelButton.addEventListener('click', () => {
      this.form.classList.add('hidden');
    });
    this.textArea.addEventListener('keydown', () => {
      // console.log(this.textArea.value);
      this.form.classList.remove('disable');
    });
    this.textArea.addEventListener('keyup', () => {
      if (this.textArea.value.length < 1) {
        this.form.classList.add('disable');
      }
    });
    this.createButton.addEventListener('click', () => {
      if (this.form.classList.contains('disable')) {
        return;
      }

      const noteObject = {
        key: 123,
        title: this.textArea.value,
        name: 'ADMIN',
      };

      this.appendNote(noteObject);
      this.textArea.value = null;
      this.form.classList.add('disable');
      this.form.classList.add('hidden');
    });
  }
}
