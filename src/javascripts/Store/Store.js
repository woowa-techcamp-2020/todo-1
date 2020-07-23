class Store {
  constructor() {
    this.router = null;
    this.modalManager = null;
    this.userPermissions = {
      1: {
        read: true,
        move: true,
        edit: true,
        delete: true,
      },
      2: {
        read: true,
        move: true,
        edit: false,
        delete: false,
      },
      3: {
        read: true,
        move: true,
        edit: true,
        delete: false,
      },
      4: {
        read: true,
        move: true,
        edit: false,
        delete: true,
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
