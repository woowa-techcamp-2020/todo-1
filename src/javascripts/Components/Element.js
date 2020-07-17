export default class Element {
  render() {
    if (this.setEventListeners) {
      this.setEventListeners();
    }
    return this.element;
  }
}
