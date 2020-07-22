const safePromise = require('../../utils/safePromise');

const Kanban = require('../dto/Kanban');
const Column = require('../dto/Column');
const Note = require('../dto/Note');

module.exports = async function get(kanbanId) {
  const [connection, connectionError] = await safePromise(this.getConnection());
  if (connectionError) {
    throw connectionError;
  }

  const [kanbanRow, kanbanRowError] = await safePromise(
    this.executeQuery(connection, `SELECT title FROM KANBAN WHERE id = ?`, [
      kanbanId,
    ]),
  );

  if (kanbanRowError) {
    throw kanbanRowError;
  }
  if (kanbanRow.length === 0) {
    return undefined;
  }

  const { title } = kanbanRow[0];

  const [rows, rowsError] = await safePromise(
    this.executeQuery(
      connection,
      `SELECT 
        J.columnId as 'columnId', J.columnTitle as 'columnTitle', 
        J.noteId as 'noteId', J.user_id as 'user_id', U.name as 'userName', 
        J.content as 'content', J.prevNoteId as 'prevNoteId', J.nextNoteId as 'nextNoteId'
      FROM 
      (
        SELECT 
          C.id as 'columnId', C.title as 'columnTitle', N.id as 'noteId', C.order as 'columnOrder',
          N.user_id as 'user_id', N.content as 'content', N.prev_note_id as 'prevNoteId', 
          N.next_note_id as 'nextNoteId'
        FROM \`COLUMN\` as C 
        LEFT JOIN NOTE as N
        ON C.id = N.column_id 
        WHERE C.kanban_id = ?
      ) AS J
      LEFT JOIN USER AS U
      ON J.user_id = U.id
      ORDER BY columnOrder`,
      [kanbanId],
    ),
  );

  if (rowsError) {
    throw rowsError;
  }

  connection.release();

  const kanban = new Kanban(kanbanId, title);
  const columnsMap = new Map();
  const notesMap = new Map();
  const startsMap = new Map(); // 각 column의 시작점

  // rows를  순회하며 위 Map에 key, value로 데이터를 저장
  rows.forEach((row) => {
    if (!columnsMap.has(row.columnId)) {
      const column = new Column(row.columnId, row.columnTitle);
      columnsMap.set(row.columnId, column);
    }

    if (row.prevNoteId === null) {
      startsMap.set(row.columnId, row.noteId);
    }

    const note = new Note(row.noteId, row.content, row.userName);
    notesMap.set(row.noteId, {
      data: note,
      prevId: row.prevNoteId,
      nextId: row.nextNoteId,
    });
  });

  columnsMap.forEach((column) => {
    const startNoteId = startsMap.get(column.id);
    let note = notesMap.get(startNoteId);

    while (note !== undefined) {
      column.notes.push(note.data);
      note = notesMap.get(note.nextId);
    }
    kanban.columns.push(column);
  });

  return kanban;
};
