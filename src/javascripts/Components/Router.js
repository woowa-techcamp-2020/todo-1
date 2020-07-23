const ERROR_PAGE_KEY = Symbol('ErrorPageKey');

export default class Router {
  constructor(app) {
    this.app = app;
    this.currentPage = null;
    this.pages = new Map();
    this.paths = new Map();

    this.setEventListeners();
  }

  load(url) {
    const pathName = url instanceof URL ? url.pathname : url;
    let pageId = this.getPageIdByPath(pathName);

    // Path 목록에 등록되지 않은 경우, 에러 페이지로 이동시키기 위함
    if (!pageId) {
      pageId = ERROR_PAGE_KEY;
    }

    const { page, title } = this.getPage(pageId);
    this.render(page, title);
  }

  render(page, title) {
    if (this.currentPage !== null) {
      this.app.removeChild(this.currentPage);
    }

    this.currentPage = page.render();
    this.app.appendChild(this.currentPage);
    document.title = title;
  }

  getPageIdByPath(path) {
    return this.paths.get(path);
  }

  setPath(path, pageId) {
    this.paths.set(path, pageId);
  }

  getPage(id) {
    return this.pages.get(id);
  }

  setPage(id, title, page) {
    const data = {
      title,
      page,
    };
    this.pages.set(id, data);
  }

  setErrorPage(title, page) {
    this.setPage(ERROR_PAGE_KEY, title, page);
  }

  href(url, data) {
    history.pushState({ data }, document.title, url);
    this.load(url);
  }

  replace(url, data) {
    history.replaceState({ data }, document.title, url);
    this.load(url);
  }

  setEventListeners() {
    window.addEventListener('popstate', () => {
      const url = new URL(document.URL);
      this.load(url);
    });
  }
}
