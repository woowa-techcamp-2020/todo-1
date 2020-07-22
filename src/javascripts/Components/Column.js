import Element from './Element.js';
import Note from './Note.js';
import Store from '../Store/Store.js';
import { ModalKey } from './Modal/constants.js';

export default class Column extends Element {
  constructor(data) {
    super();

    this.notes = [];
    this.id = data.id;
    this.title = data.title;
    this.head = undefined;
    this.ul = undefined;
    this.modalManager = Store.modalManager;

    data.notes.forEach((note) => {
      this.notes.push({
        id: note.id,
        data: note,
        dom: new Note(note),
      });
    });

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.dataset.id = this.id;
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
    h1.className = 'title';
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

  editNote(noteKey, content) {
    const targetIndex = this.notes.findIndex((cur) => {
      return cur.id === parseInt(noteKey);
    });
    if (targetIndex === -1) {
      return;
    }

    const target = this.notes[targetIndex];
    target.data.content = content;
    target.dom.setContent(content);
  }

  pickNote(noteKey) {
    const targetIndex = this.notes.findIndex((cur) => {
      return cur.id === parseInt(noteKey);
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

    // console.log(this.notes);
  }

  appendNote(data) {
    const noteObject = {
      id: data.id,
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

  editNoteCallback(newText) {
    const note = Store.moduleCaller;
    const previousContent = note.querySelector('.content').innerText;
    if (newText === '' || previousContent === newText) {
      return;
    }

    const noteId = note.dataset.id;
    const body = {
      content: newText,
    };

    fetch(`/api/note/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          this.editNote(noteId, newText);
        } else {
          alert(res.message);
        }
      });
  }

  deleteNoteCallback(confirm) {
    if (!confirm) {
      return;
    }

    const note = Store.moduleCaller;
    const noteId = note.dataset.id;

    fetch(`/api/note/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          this.pickNote(noteId);
          this.ul.removeChild(note);
        } else {
          alert(res.message);
        }
      });
  }

  renameColumnCallback(newText) {
    if (newText === '') {
      return;
    }

    const column = Store.moduleCaller;
    const columnId = column.dataset.id;
  }

  _editNoteHandler(e) {
    const target = e.target;
    if (target.classList.contains('column')) {
      return;
    }

    const note = target.closest('.note');
    const noteText = note.querySelector('.content').innerText;
    const callback = this.editNoteCallback.bind(this);

    Store.moduleCaller = note;
    this.modalManager.open(ModalKey.EditNote, callback);
    this.modalManager.setInputField(noteText);
  }

  _deleteNoteHandler(e) {
    if (e.target.tagName !== 'BUTTON') {
      return;
    }

    const callback = this.deleteNoteCallback.bind(this);

    Store.moduleCaller = e.target.closest('.note');
    this.modalManager.open(ModalKey.DeleteNote, callback);
  }

  _renameColumnHandler(e) {
    if (e.target.tagName === 'BUTTON') {
      return;
    }

    const column = e.target.closest('.column');
    const titleText = column.querySelector('.title').innerText;
    const callback = this.renameColumnCallback.bind(this);

    Store.moduleCaller = column;
    this.modalManager.open(ModalKey.RenameColumn, callback);
    this.modalManager.setInputField(titleText);
  }

  setEventListeners() {
    this.ul.addEventListener('click', (e) => {
      this._deleteNoteHandler(e);
    });
    this.ul.addEventListener('dblclick', (e) => {
      this._editNoteHandler(e);
    });
    this.head.addEventListener('dblclick', (e) => {
      this._renameColumnHandler(e);
    });

    this.addButton.addEventListener('click', () => {
      this.form.classList.remove('hidden');
    });
    this.cancelButton.addEventListener('click', () => {
      this.form.classList.add('hidden');
    });
    this.textArea.addEventListener('keydown', () => {
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

      const body = {
        user: 'tester',
        userId: 1,
        content: this.textArea.value,
      };
      fetch(`/api/column/${this.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            const noteObject = {
              id: res.data.id,
              content: res.data.content,
              user: res.data.user,
            };

            this.appendNote(noteObject);
            this.textArea.value = null;
            this.form.classList.add('disable');
            this.form.classList.add('hidden');
          }
        });
    });
  }
}
