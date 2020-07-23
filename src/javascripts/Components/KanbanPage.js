import Element from './Element.js';
import Header from './Header.js';
import Kanban from './Kanban.js';
import ActivityLog from './ActivityLog.js';
import ModalManager from './ModalManager.js';
import Store from '../Store/Store.js';

// eslint-disable-next-line no-unused-vars
import kanban from '../../stylesheets/kanban.css';

export default class KanbanPage extends Element {
  constructor() {
    super();
    Store.modalManager = new ModalManager();

    this.header = new Header();
    this.activityLog = new ActivityLog();
    this.kanban = null;
    this.modalManager = Store.modalManager;

    this.setElement();
  }

  fetchKanbanData() {
    const kanbanId = 1;
    fetch(`/api/get/${kanbanId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('fetch complete');

        this.kanban = new Kanban(res.data).render();
        this.element.appendChild(this.kanban);
      });
  }

  setEventListeners() {
    this.header.menuButton.addEventListener('click', () => {
      this.activityLog.openActivityLog();
    });
  }

  runWhenRender() {
    if (Store.user.id === null && !Store.isRequestTokenInfo) {
      alert('로그인이 필요합니다.');
      window.location.href = '/';
      return;
    }
    this.fetchKanbanData();
  }

  setElement() {
    const wrapper = document.createElement('div');

    wrapper.appendChild(this.header.render());
    wrapper.appendChild(this.activityLog.render());
    wrapper.appendChild(this.modalManager.render());

    this.element = wrapper;
  }
}
