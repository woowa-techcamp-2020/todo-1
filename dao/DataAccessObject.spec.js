require('regenerator-runtime');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const DataAccessObject = require('./DataAccessObject');
const testPool = require('./constants/poolOptions').test;

const dao = new DataAccessObject(testPool);

test('connect is success.', async () => {
  const success = await dao.isConnectSuccess();
  expect(success).toBe(true);
});

test('return a user object', async () => {
  const user = await dao.getUserById(1);
  expect(user).toEqual({
    id: 1,
    name: 'CAMP',
    profile_image: '{filename}',
  });

  dao.endPool();
});
