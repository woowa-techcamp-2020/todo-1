import Modal from './Modal.js';

export default class DeleteNoteModal extends Modal {
  constructor() {
    super();

    this.setElement();
  }

  setNoteText(text) {
    this.element.querySelector('textarea').value = text;
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal delete-note-modal';

    return wrapper;
  }

  getSection() {
    const section = document.createElement('body');
    section.className = 'content';

    const message = document.createElement('div');
    message.className = 'message';
    message.innerText = '선택하신 노트를 삭제하시겠습니까?';

    const buttonYes = document.createElement('button');
    buttonYes.innerText = '예';

    const buttonNo = document.createElement('button');
    buttonNo.innerText = '아니오';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-box';

    buttonContainer.appendChild(buttonYes);
    buttonContainer.appendChild(buttonNo);

    section.appendChild(message);
    section.appendChild(buttonContainer);

    return section;
  }

  setElement() {
    const wrapper = this.getWrapper();
    const header = this.getHeader('Confirm');
    const section = this.getSection();

    wrapper.appendChild(header);
    wrapper.appendChild(section);

    this.element = wrapper;
  }
}
