import Element from './Element.js';
import UserList from './UserList.js';

// eslint-disable-next-line no-unused-vars
import login from '../../stylesheets/login.css';

const data = {
  key: 1,
  users: [
    {
      key: 1,
      name: '크롱롱',
      profileIamge: '/images/profile_1.png',
    },
    {
      key: 2,
      name: '배달이',
      profileIamge: '/images/profile_2.png',
    },
    {
      key: 3,
      name: '병아리',
      profileIamge: '/images/profile_3.png',
    },
    {
      key: 4,
      name: '우하니',
      profileIamge: '/images/profile_4.png',
    },
  ],
};

const requestAccessToken = (userId) => {
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = '/kanban';
        return;
      }

      alert(`${data.message}`);
    })
    .catch((error) => console.log(error));
};

export default class LoginPage extends Element {
  constructor() {
    super();
    this.userList = null;

    this.setElement();
  }

  fetchUserList() {
    setTimeout(() => {
      this.userList = new UserList(data, requestAccessToken).render();
      this.element.appendChild(this.userList);
    }, 0);
  }

  setElement() {
    const wrapper = document.createElement('div');
    wrapper.className = 'login-page';
    this.fetchUserList();

    this.element = wrapper;
  }
}
