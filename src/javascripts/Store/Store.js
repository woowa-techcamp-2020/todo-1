class Store {
  constructor() {
    this.router = null;
    this.modalManager = null;
    this.userPermissions = {
      1: {
        read: true,
        move: true,
        edit: false,
        delete: false,
      },
      2: {
        read: true,
        move: true,
        edit: false,
        delete: false,
      },
    };
    this.user = {
      id: null,
      name: null,
      permission: null,
    };
  }
}

module.exports = new Store();
