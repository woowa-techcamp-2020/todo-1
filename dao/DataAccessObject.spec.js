require('regenerator-runtime');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const DataAccessObject = require('./DataAccessObject');
const testPool = require('./constants/poolOptions').test;

const dao = new DataAccessObject(testPool);

let targetNoteId;

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
  targetNoteId = note.id;

  expect(note.user).toEqual(newNoteData.user);
  expect(note.content).toEqual(newNoteData.content);
});

test('update note test', async () => {
  const content = 'update note content';
  let noteId = -1;
  let result;

  result = await dao.updateNote(noteId, content);
  expect(result).toEqual(false);

  // 이전 insert 문에서 생성된 note의 id를 사용함
  noteId = targetNoteId;
  result = await dao.updateNote(noteId, content);

  expect(result).toEqual(true);
});

test('delete note test', async () => {
  // 이전 insert 문에서 생성된 note의 id를 사용함
  const noteId = targetNoteId;
  const result = await dao.deleteNote(noteId);

  expect(result).toEqual(true);
});

test('move note test', async () => {
  // 이전 insert 문에서 생성된 note의 id를 사용함
  const noteId = 1;
  let result;

  result = await dao.moveNote(noteId, 3, 4);
  expect(result).toEqual(true);

  result = await dao.moveNote(noteId, null, 3);
  expect(result).toEqual(true);

  result = await dao.moveNote(noteId, 7, null);
  expect(result).toEqual(true);

  result = await dao.moveNote(noteId, null, 33);
  expect(result).toEqual(true);

  result = await dao.moveNote(noteId, null, null);
  expect(result).toEqual(false);
});

afterAll(() => {
  dao.endPool();
});
