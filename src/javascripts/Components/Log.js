import Element from './Element.js';

export default class Log extends Element {
  constructor(data) {
    super();

    this.id = data.id;
    this.user = data.userName;
    this.noteTitle = data.noteTitle;
    this.method = data.method;
    this.columnFrom = data.columnTitle;
    this.columnTo = data.columnToTitle;
    this.changeTitle = data.changeTitle;
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

    switch (this.method) {
      case 'CREATE': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${
          this.noteTitle
        }</p><p>at</p><p>${this.columnFrom}</p>`;

        break;
      }
      case 'MOVE': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${
          this.noteTitle
        }</p><p>from</p><p>${this.columnFrom}</p><p>to</p><p>${
          this.columnTo
        }</p>`;

        break;
      }
      case 'MODIFY': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${
          this.noteTitle
        }</p><p>to</p><p>${this.changeTitle}</p>`;

        break;
      }
      case 'DELETE': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${
          this.noteTitle
        }</p><p>at</p><p>${this.columnFrom}</p>`;

        break;
      }
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
