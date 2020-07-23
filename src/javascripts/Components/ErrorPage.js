import Element from './Element.js';

// eslint-disable-next-line no-unused-vars
import style from '../../stylesheets/error.css';

export default class ErrorPage extends Element {
  constructor() {
    super();

    this.setElement();
  }

  getWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'error-page';

    return wrapper;
  }

  getContent() {
    const container = document.createElement('div');
    container.className = 'container';

    const title = document.createElement('h1');
    title.className = 'title';
    title.innerText = '에러!!!';

    const message = document.createElement('div');
    message.className = 'message';
    message.innerText = '찾는 페이지가 없습니다.';

    container.appendChild(title);
    container.appendChild(message);

    return container;
  }

  setElement() {
    const wrapper = this.getWrapper();
    const content = this.getContent();

    wrapper.appendChild(content);
    this.element = wrapper;
  }
}
