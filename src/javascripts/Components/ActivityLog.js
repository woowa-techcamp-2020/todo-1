import Element from './Element.js';
import Log from './Log.js';

// eslint-disable-next-line no-unused-vars
import style from '../../stylesheets/activityLog.css';

const mockData = {
  data: '@hello',
  noteTitle: '집에가기',
  method: 'moved',
  columnFrom: 'Todo',
  columnTo: 'Done',
};

const mockDatas = [];

for (let i = 0; i < 10; i++) {
  mockDatas.push(mockData);
}

export default class ActivityLog extends Element {
  constructor() {
    super();

    this.logs = [];

    this.wrapper = undefined;
    this.closeButton = undefined;
    this.ul = undefined;
    this.moreButton = undefined;
    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.id = 'activity_log';
    wrapper.className = 'close';

    this.wrapper = wrapper;
    return wrapper;
  }

  getHead() {
    const head = document.createElement('div');
    head.className = 'head';

    const componentName = document.createElement('div');
    componentName.innerText = 'menu';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';

    this.closeButton = closeButton;

    head.appendChild(componentName);
    head.appendChild(closeButton);

    return head;
  }

  getUl() {
    const ul = document.createElement('ul');

    this.ul = ul;
    return ul;
  }

  getMoreButton() {
    const moreButton = document.createElement('button');
    moreButton.className = 'more';
    moreButton.innerText = '더보기';

    this.moreButton = moreButton;
    return moreButton;
  }

  appendLi(data) {
    const log = new Log(data);
    this.ul.appendChild(log.render());
  }

  fetchData() {
    mockDatas.forEach((data) => {
      this.logs.push(data);
      this.appendLi(data);
    });
  }

  openActivityLog() {
    this.element.classList.remove('close');
  }

  setElement() {
    const wrapper = this.getWrapper();

    wrapper.appendChild(this.getHead());
    wrapper.appendChild(this.getUl());
    wrapper.appendChild(this.getMoreButton());

    this.element = wrapper;
  }

  setEventListeners() {
    this.closeButton.addEventListener('click', () => {
      this.wrapper.classList.add('close');
    });
    this.moreButton.addEventListener('click', () => {
      this.fetchData();
    });
    this.element.addEventListener('scroll', () => {
      const scrollY = this.element.scrollHeight - this.element.scrollTop;
      if (scrollY === this.element.clientHeight) {
        this.fetchData();
      }
    });
  }
  render() {
    this.setEventListeners();
    this.fetchData();

    return this.element;
  }
}
