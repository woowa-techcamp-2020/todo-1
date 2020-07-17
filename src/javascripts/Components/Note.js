import Element from './Element.js';

export default class Note extends Element {
  constructor(data) {
    super();

    this.key = data.key;
    this.title = data.title;
    this.name = data.name;

    this.setElement();
  }

  getWrapper() {
    const li = document.createElement('li');
    li.dataset.key = this.key;

    return li;
  }

  getFooter() {
    const footer = document.createElement('footer');

    const p = document.createElement('p');
    p.className = 'comment';
    p.innerText = 'Add by';
    const p_writter = document.createElement('p');
    p_writter.className = 'writter';
    p_writter.innerText = `${this.name}`;
    footer.appendChild(p);
    footer.appendChild(p_writter);

    return footer;
  }

  getSection() {
    const section = document.createElement('section');
    section.className = 'content';
    section.innerText = `${this.title}`;

    return section;
  }

  setElement() {
    const wrapper = this.getWrapper();

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