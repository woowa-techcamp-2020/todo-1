import '@babel/polyfill';

// eslint-disable-next-line no-unused-vars
import style from './stylesheets/style.css';

import KanbanPage from './javascripts/Components/KanbanPage.js';

const app = document.querySelector('#app');

const kanbanPage = new KanbanPage().render();

app.appendChild(kanbanPage);
