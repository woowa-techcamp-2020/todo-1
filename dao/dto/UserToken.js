class UserToken {
  constructor(attrs) {
    this.id = attrs?.id;
    this.userId = attrs?.userId;
    this.token = attrs?.token;
    this.expiredAt = attrs?.expiredAt;
  }
}

module.exports = UserToken;
