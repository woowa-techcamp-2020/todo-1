import '@babel/polyfill';

import Store from './javascripts/Store/Store.js';
import Router from './javascripts/Components/Router.js';
import KanbanPage from './javascripts/Components/KanbanPage.js';
import LoginPage from './javascripts/Components/Loginpage.js';
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

const url = new URL(document.URL);
router.load(url);
