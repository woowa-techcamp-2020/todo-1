import Element from './Element.js';
import Header from './Header.js';
import Kanban from './Kanban.js';

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
    this.kanban = null;

    this.setElement();
  }

  fetchKanbanData() {
    setTimeout(() => {
      this.kanban = new Kanban(data).render();
      this.element.appendChild(this.kanban);
    }, 0);
  }

  setElement() {
    const wrapper = document.createElement('div');

    wrapper.appendChild(this.header.render());
    this.fetchKanbanData();

    this.element = wrapper;
  }
}
