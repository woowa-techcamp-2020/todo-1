import Element from './Element.js';

export default class User extends Element {
  constructor(data) {
    super();

    this.key = data.key;
    this.name = data.name;
    this.profileIamge = data.profileIamge;

    this.setElement();
  }

  getWrapper() {
    const div = document.createElement('div');
    div.className = 'user';
    div.dataset.key = this.key;

    return div;
  }

  getName() {
    const div = document.createElement('div');
    div.className = 'name';
    div.innerText = this.name;

    return div;
  }

  getProfileImage() {
    const img = document.createElement('img');
    img.src = this.profileIamge;
    img.alt = `${this.name}의 프로필 이미지`;
    img.className = 'profile-image';

    return img;
  }

  setElement() {
    const wrapper = this.getWrapper();

    const bottom = this.getName();
    const profile = this.getProfileImage();

    wrapper.appendChild(profile);
    wrapper.appendChild(bottom);

    this.element = wrapper;
  }
}
