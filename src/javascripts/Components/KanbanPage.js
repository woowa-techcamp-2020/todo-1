import Element from './Element.js';
import Header from './Header.js';
import Kanban from './Kanban.js';

// eslint-disable-next-line no-unused-vars
import kanban from '../../stylesheets/kanban.css';

const data = {
  columns: [
    {
      title: 'Todo',
      notes: [
        {
          title: '첫번쨰 할일',
          name: 'crong',
        },
        {
          title: '두번쨰 할일',
          name: 'pobi',
        },
      ],
    },
    {
      title: 'Doing',
      notes: [
        {
          title: '세번쨰 할일',
          name: 'woowa',
        },
        {
          title: '네번쨰 할일',
          name: 'boost',
        },
      ],
    },
    {
      title: 'Done',
      notes: [
        {
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

    this.setElement();
    this.fetchKanbanData();
  }

  fetchKanbanData() {
    setTimeout(() => {
      this.kanban = new Kanban(data).render();
      this.element.appendChild(this.kanban);
    }, 0);
  }

  setElement() {
    const wrapper = document.createElement('div');

    this.header = new Header().render();
    this.kanban = null;

    wrapper.appendChild(this.header);

    this.element = wrapper;
  }
}
