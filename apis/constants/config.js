module.exports = {
  COOKIE_MAX_AGE:
    require('../../dao/constants/config').TOKEN_AGE_SECONDS * 1000,
  COOKIE_NAME: 'token_id',
};
