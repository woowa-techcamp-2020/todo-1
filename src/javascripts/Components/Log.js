import Element from './Element.js';

export default class Log extends Element {
  constructor(data) {
    super();

    this.user = data.user;
    this.noteTitle = data.noteTitle;
    this.method = data.method;
    this.columnFrom = data.columnFrom;
    this.columnTo = data.columnTo;
    this.time = data.time;

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('li');

    return wrapper;
  }

  getLogDetail() {
    const log = document.createElement('div');
    log.className = 'log';

    const userP = document.createElement('p');
    userP.className = 'user';
    userP.innerText = this.user;
    const methodP = document.createElement('p');
    methodP.innerText = this.method;
    const noteTitleP = document.createElement('p');
    noteTitleP.className = 'title';
    noteTitleP.innerText = this.noteTitle;
    const fromP = document.createElement('p');
    fromP.innerText = 'from';
    const columnFromP = document.createElement('p');
    columnFromP.innerText = this.columnFrom;
    const toP = document.createElement('p');
    toP.innerText = 'to';
    const columnToP = document.createElement('p');
    columnToP.innerText = this.columnTo;

    log.appendChild(userP);
    log.appendChild(methodP);
    log.appendChild(noteTitleP);
    log.appendChild(fromP);
    log.appendChild(columnFromP);

    if (this.method === 'moved') {
      log.appendChild(toP);
      log.appendChild(columnToP);
    }

    return log;
  }

  getTime() {
    const timeP = document.createElement('p');
    timeP.className = 'time';
    timeP.innerText = this.time;

    return timeP;
  }

  setElement() {
    const wrapper = this.getWrapper();
    wrapper.appendChild(this.getLogDetail());
    wrapper.appendChild(this.getTime());

    this.element = wrapper;
  }
}
