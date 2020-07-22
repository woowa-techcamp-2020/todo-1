import Modal from './Modal.js';

export default class EditNoteModal extends Modal {
  constructor() {
    super();

    this.textarea = null;
    this.saveButton = null;
    this.setElement();
  }

  setFocusWhenOpened() {
    this.textarea.focus();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal edit-note-modal';

    return wrapper;
  }

  getSection() {
    const section = document.createElement('section');
    section.className = 'content';

    const message = document.createElement('div');
    message.className = 'message';
    message.innerText = 'Note';

    const textarea = document.createElement('textarea');
    textarea.className = 'input-field';
    textarea.maxLength = 500;
    this.textarea = textarea;

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save';
    saveButton.innerText = 'Save Note';
    this.saveButton = saveButton;

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

  setEventListeners() {
    this.textarea.addEventListener('keydown', () => {
      if (this.textarea.value.length > 0) {
        this.saveButton.disabled = false;
      }
    });
    this.textarea.addEventListener('keyup', () => {
      if (this.textarea.value.length < 1) {
        this.saveButton.disabled = true;
      }
    });
  }

  setInputField(text) {
    this.textarea.value = text;
  }

  getData() {
    return this.textarea.value;
  }
}
