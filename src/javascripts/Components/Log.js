import Element from './Element.js';

function cutLongString(string) {
  let ret = string;
  if (ret.length > 13) {
    ret = ret.substring(0, 10);
    ret += '...';
  }
  return ret;
}

export default class Log extends Element {
  constructor(data) {
    super();

    this.now = new Date();
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
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${cutLongString(
          this.noteTitle,
        )}</p><p>at</p><p>${this.columnFrom}</p>`;

        break;
      }
      case 'MOVE': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${cutLongString(
          this.noteTitle,
        )}</p><p>from</p><p>${this.columnFrom}</p><p>to</p><p>${
          this.columnTo
        }</p>`;

        break;
      }
      case 'MODIFY': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${cutLongString(
          this.noteTitle,
        )}</p><p>to</p><p class="title">${cutLongString(this.changeTitle)}</p>`;

        break;
      }
      case 'DELETE': {
        log.innerHTML = `<p class="user">${
          this.user
        }</p><p>${this.method.toLowerCase()}</p><p class="title">${cutLongString(
          this.noteTitle,
        )}</p><p>at</p><p>${this.columnFrom}</p>`;

        break;
      }
    }

    return log;
  }

  getTime() {
    const timeP = document.createElement('p');
    timeP.className = 'time';

    const created = new Date(this.time);
    const diff = this.now - created;

    if (diff > 24 * 60 * 60 * 1000) {
      timeP.innerText = `하루 이전`;
    } else if (diff > 60 * 60 * 1000) {
      const hour = Math.floor(diff / (60 * 60 * 1000));
      timeP.innerText = `${hour}시간 이전`;
    } else if (diff > 60 * 1000) {
      const min = Math.floor(diff / (60 * 1000));
      timeP.innerText = `${min}분 이전`;
    } else {
      timeP.innerText = `1분 이내`;
    }

    // timeP.innerText = this.time;

    return timeP;
  }

  setElement() {
    const wrapper = this.getWrapper();
    wrapper.appendChild(this.getLogDetail());
    wrapper.appendChild(this.getTime());

    this.element = wrapper;
  }
}
