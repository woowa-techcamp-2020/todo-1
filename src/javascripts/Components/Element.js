export default class Element {
  render() {
    if (this.runWhenRender) {
      this.runWhenRender();
    }

    if (this.setEventListeners) {
      this.setEventListeners();
    }

    return this.element;
  }
}
