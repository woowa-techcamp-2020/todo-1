import Element from './Element.js';

export default class Note extends Element {
  constructor(data) {
    super();

    this.id = data.id;
    this.content = data.content;
    this.user = data.user;

    this.setElement();
  }

  getWrapper() {
    const li = document.createElement('li');
    li.dataset.id = this.id;

    return li;
  }

  getFooter() {
    const footer = document.createElement('footer');

    const p = document.createElement('p');
    p.className = 'comment';
    p.innerText = 'Add by';
    const p_writter = document.createElement('p');
    p_writter.className = 'writter';
    p_writter.innerText = `${this.user}`;
    footer.appendChild(p);
    footer.appendChild(p_writter);

    return footer;
  }

  getSection() {
    const section = document.createElement('section');
    section.className = 'content';
    section.innerText = `${this.content}`;

    return section;
  }

  setContent(text) {
    this.content = text;
    this.element.querySelector('.content').innerText = text;
  }

  setElement() {
    const wrapper = this.getWrapper();
    wrapper.className = 'note';

    const button = document.createElement('button');
    button.className = 'close';
    button.innerText = 'X';

    const section = this.getSection();
    const hr = document.createElement('hr');
    const footer = this.getFooter(name);

    wrapper.appendChild(button);
    wrapper.appendChild(section);
    wrapper.appendChild(hr);
    wrapper.appendChild(footer);

    this.element = wrapper;
  }
}
