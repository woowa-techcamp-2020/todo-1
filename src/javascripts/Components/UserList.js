import Element from './Element.js';
import User from './User.js';

export default class UserList extends Element {
  constructor(data, requestAccessToken) {
    super();

    this.key = data.key;
    this.requestAccessToken = requestAccessToken;
    this.users = data.users.map((user) => {
      const dom = new User(user).render();
      dom.addEventListener('click', (e) => this._clickFromUser(e));
      return dom;
    });

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'login__user-list';
    return wrapper;
  }

  getHeader() {
    const header = document.createElement('div');
    header.className = 'header';
    header.innerText = '사용하실 프로필을 선택해주세요.';
    return header;
  }

  getContainer() {
    const container = document.createElement('div');
    container.className = 'list';
    return container;
  }

  addUser(container) {
    this.users.forEach((user) => {
      container.appendChild(user);
    });
  }

  setElement() {
    const wrapper = this.getWrapper();
    const header = this.getHeader();
    const container = this.getContainer();
    this.addUser(container);

    wrapper.appendChild(header);
    wrapper.appendChild(container);
    this.element = wrapper;
  }

  _clickFromUser(e) {
    const userId = e.target.parentNode.dataset.key;
    this.requestAccessToken(userId);
  }
}
