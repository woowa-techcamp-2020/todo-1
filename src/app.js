import '@babel/polyfill';

import Store from './javascripts/Store/Store.js';
import { getCookie, deleteCookie } from './javascripts/Utils/cookie.js';
import Router from './javascripts/Components/Router.js';
import KanbanPage from './javascripts/Components/KanbanPage.js';
import LoginPage from './javascripts/Components/LoginPage.js';
import ErrorPage from './javascripts/Components/ErrorPage.js';

// eslint-disable-next-line no-unused-vars
import style from './stylesheets/style.css';

const app = document.querySelector('#app');
const router = new Router(app);
Store.router = router;

const kanbanPage = new KanbanPage();
const loginPage = new LoginPage();
const errorPage = new ErrorPage();

router.setPage('login', '로그인', loginPage);
router.setPage('kanban', '칸반', kanbanPage);
router.setErrorPage('에러', errorPage);

router.setPath('/', 'login');
router.setPath('/kanban', 'kanban');

if (getCookie('token_id') && Store.user.id === null) {
  Store.isRequestTokenInfo = true;
  fetch('/api/user/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Store.user = {
          id: data.info.id,
          name: data.info.name,
          permission: Store.userPermissions[data.info.id],
        };
        return;
      }

      alert(`${data.message}`);
      Store.isRequestTokenInfo = false;
      deleteCookie('token_id');
      window.location.href = '/';
    })
    .catch((error) => console.log(error));
}

const url = new URL(document.URL);
router.load(url);
