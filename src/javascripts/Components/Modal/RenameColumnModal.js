import Modal from './Modal.js';

export default class RenameColumnModal extends Modal {
  constructor() {
    super();

    this.setElement();
  }

  setNoteText(text) {
    this.element.querySelector('textarea').value = text;
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

    const input = document.createElement('input');
    input.type = 'text';
    input.class = 'input-field';

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save';
    saveButton.innerText = 'Update Column';

    section.appendChild(message);
    section.appendChild(input);
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
}
