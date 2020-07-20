import Element from './Element.js';
import Header from './Header.js';
import Kanban from './Kanban.js';
import ActivityLog from './ActivityLog.js';
import ModalManager from './ModalManager.js';

// eslint-disable-next-line no-unused-vars
import kanban from '../../stylesheets/kanban.css';

const data = {
  key: '1',
  columns: [
    {
      key: 1,
      title: 'Todo',
      notes: [
        {
          key: 1,
          title: '첫번쨰 할일',
          name: 'crong',
        },
        {
          key: 2,
          title: '두번쨰 할일',
          name: 'pobi',
        },
      ],
    },
    {
      key: 2,
      title: 'Doing',
      notes: [
        {
          key: 3,
          title: '세번쨰 할일',
          name: 'woowa',
        },
        {
          key: 4,
          title: '네번쨰 할일',
          name: 'boost',
        },
      ],
    },
    {
      key: 3,
      title: 'Done',
      notes: [
        {
          key: 5,
          title: '다섯번쨰 할일',
          name: 'superman',
        },
      ],
    },
  ],
};

export default class KanbanPage extends Element {
  constructor() {
    super();
    this.header = new Header();
    this.activityLog = new ActivityLog();
    this.kanban = null;
    this.modalManager = new ModalManager();

    this.setElement();
  }

  fetchKanbanData() {
    setTimeout(() => {
      this.kanban = new Kanban(data, this.modalManager).render();
      this.element.appendChild(this.kanban);
    }, 0);
  }

  setEventListeners() {
    this.header.menuButton.addEventListener('click', () => {
      this.activityLog.openActivityLog();
    });
  }

  setElement() {
    const wrapper = document.createElement('div');

    wrapper.appendChild(this.header.render());
    this.fetchKanbanData();
    wrapper.appendChild(this.activityLog.render());
    wrapper.appendChild(this.modalManager.render());

    this.element = wrapper;
  }
}
