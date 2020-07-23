class Store {
  constructor() {
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
      name: 'superman',
      permission: this.userPermissions[1],
    };
  }
}

module.exports = new Store();
