import Element from './Element.js';
import EditNoteModal from './Modal/EditNoteModal.js';
import DeleteNoteModal from './Modal/DeleteNoteModal.js';
import RenameColumnModal from './Modal/RenameColumnModal.js';

// eslint-disable-next-line no-unused-vars
import modalStyle from '../../stylesheets/modal.css';

export default class ModalManager extends Element {
  constructor() {
    super();

    this.editNoteModal = null;
    this.deleteNoteModal = null;
    this.renameColumnModal = null;

    this.createAllModal();
    this.setElement();
  }

  createAllModal() {
    this.editNoteModal = new EditNoteModal();
    this.deleteNoteModal = new DeleteNoteModal();
    this.renameColumnModal = new RenameColumnModal();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-container';

    return wrapper;
  }

  setElement() {
    const wrapper = this.getWrapper();
    wrapper.appendChild(this.editNoteModal.render());
    wrapper.appendChild(this.deleteNoteModal.render());
    wrapper.appendChild(this.renameColumnModal.render());

    this.element = wrapper;
  }
}
