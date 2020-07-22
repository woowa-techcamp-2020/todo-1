import Modal from './Modal.js';

export default class RenameColumnModal extends Modal {
  constructor() {
    super();

    this.inputField = null;
    this.saveButton = null;
    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal rename-column-modal';

    return wrapper;
  }

  getSection() {
    const section = document.createElement('body');
    section.className = 'content';

    const message = document.createElement('div');
    message.className = 'message';
    message.innerText = 'Column Name';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'input-field';
    inputField.maxLength = 50;
    this.inputField = inputField;

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save';
    saveButton.innerText = 'Update Column';
    this.saveButton = saveButton;

    section.appendChild(message);
    section.appendChild(inputField);
    section.appendChild(saveButton);

    return section;
  }

  setElement() {
    const wrapper = this.getWrapper();
    const header = this.getHeader('Rename Column');
    const section = this.getSection();

    wrapper.appendChild(header);
    wrapper.appendChild(section);

    this.element = wrapper;
  }

  setInputField(text) {
    this.inputField.value = text;
  }

  getData() {
    return this.inputField.value;
  }
}
