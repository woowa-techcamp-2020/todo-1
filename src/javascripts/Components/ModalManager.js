import Element from './Element.js';
import EditNoteModal from './Modal/EditNoteModal.js';
import DeleteNoteModal from './Modal/DeleteNoteModal.js';
import RenameColumnModal from './Modal/RenameColumnModal.js';
import { ModalKey } from './Modal/constants.js';

// eslint-disable-next-line no-unused-vars
import modalStyle from '../../stylesheets/modal.css';

export default class ModalManager extends Element {
  constructor() {
    super();
    this.callback = null;
    this.modals = new Map();

    this.createAllModal();
    this.setElement();
  }

  createAllModal() {
    this.modals.set(ModalKey.DeleteNote, new DeleteNoteModal());
    this.modals.set(ModalKey.EditNote, new EditNoteModal());
    this.modals.set(ModalKey.RenameColumn, new RenameColumnModal());
  }

  open(modalKey, callback) {
    this.currentModalKey = modalKey;
    this.callback = callback;
    this.getModal(modalKey).show();
  }

  getModal(modalKey) {
    return this.modals.get(modalKey);
  }

  getCurrentModal() {
    return this.getModal(this.currentModalKey);
  }

  setInputField(text) {
    const modal = this.getCurrentModal();
    if (modal.setInputField) {
      modal.setInputField(text);
    }
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-container';
    wrapper.tabIndex = '-1';

    return wrapper;
  }

  setElement() {
    const wrapper = this.getWrapper();
    const editNoteModal = this.getModal(ModalKey.EditNote);
    const deleteNoteModal = this.getModal(ModalKey.DeleteNote);
    const renameColumnModal = this.getModal(ModalKey.RenameColumn);

    wrapper.appendChild(editNoteModal.render());
    wrapper.appendChild(deleteNoteModal.render());
    wrapper.appendChild(renameColumnModal.render());

    this.element = wrapper;
  }

  _keydown(e) {
    if (e.key === 'Escape') {
      this.getModal(this.currentModalKey).hide();
    }
  }

  _click(e) {
    const target = e.target;
    const modal = this.getCurrentModal();
    if (!modal) {
      return;
    }

    if (
      target.classList.contains('modal-container') ||
      target.classList.contains('btn-close')
    ) {
      modal.hide();
      return;
    }

    if (
      target.classList.contains('btn-save') ||
      target.id === 'btnDeleteNote'
    ) {
      const data = modal.getData();
      this.callback(data);
      modal.hide();
      return;
    }
  }

  setEventListeners() {
    this.element.addEventListener('keydown', (e) => {
      this._keydown(e);
    });

    this.element.addEventListener('click', (e) => {
      this._click(e);
    });
  }
}
