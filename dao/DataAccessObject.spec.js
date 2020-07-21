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
});

test('get note rows test', async () => {
  const kanban = await dao.getKanbanData(1);

  expect(kanban.id).toEqual(1);
  expect(kanban.title).toEqual('test');
});

test('insert note rows test', async () => {
  const newNoteData = {
    userId: 1,
    user: 'TEST',
    content: 'INSERT DAO TEST',
  };
  const note = await dao.createNote(1, newNoteData);

  expect(note.user).toEqual(newNoteData.user);
  expect(note.content).toEqual(newNoteData.content);
});

afterAll(() => {
  dao.endPool();
});
