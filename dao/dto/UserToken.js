class UserToken {
  constructor(attrs) {
    this.id = attrs?.id;
    this.userId = attrs?.userId ?? attrs?.user_id;
    this.token = attrs?.token;
    this.expiredAt = attrs?.expiredAt ?? attrs?.expired_at;
  }
}

module.exports = UserToken;
