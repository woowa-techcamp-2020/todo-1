import Modal from './Modal.js';

export default class EditNoteModal extends Modal {
  constructor() {
    super();

    this.setElement();
  }

  setNoteText(text) {
    this.element.querySelector('textarea').value = text;
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal edit-note-modal';

    return wrapper;
  }

  getSection() {
    const section = document.createElement('body');
    section.className = 'content';

    const message = document.createElement('div');
    message.className = 'message';
    message.innerText = 'Note';

    const textarea = document.createElement('textarea');
    textarea.class = 'input-field';

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save';
    saveButton.innerText = 'Save Note';

    section.appendChild(message);
    section.appendChild(textarea);
    section.appendChild(saveButton);

    return section;
  }

  setElement() {
    const wrapper = this.getWrapper();
    const header = this.getHeader('Edit Note');
    const section = this.getSection();

    wrapper.appendChild(header);
    wrapper.appendChild(section);

    this.element = wrapper;
  }
}
