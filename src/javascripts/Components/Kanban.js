import Element from './Element.js';
import Column from './Column.js';

export default class Kanban extends Element {
  constructor(kanban) {
    super();

    this.columns = [];
    kanban.columns.forEach((column) => {
      this.columns.push({
        data: column,
        dom: new Column(column),
      });
    });

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'kanban';
    wrapper.id = 'mytodo';

    return wrapper;
  }

  addColumn(wrapper) {
    this.columns.forEach((column) => {
      wrapper.appendChild(column.dom.render());
    });
  }

  setElement() {
    const wrapper = this.getWrapper();
    this.addColumn(wrapper);

    this.element = wrapper;
  }

  setEventListeners() {
    // this.element.addEventListener();
  }
}
