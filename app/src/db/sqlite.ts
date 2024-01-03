import { resolve } from 'path';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.sqlite');

async function createTable() {
  await db.serialize(async () => {
    await db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      name TEXT,
      is_teacher BOOLEAN
    )
  `);
  });
}

async function insertUser(username: string, isTeacher = false) {
  await db.serialize(async () => {
    const insertUser = db.prepare('INSERT INTO user (name, is_teacher) VALUES (?, ?)');
    await insertUser.run(username, isTeacher);
    await insertUser.finalize();
    return 0;
  });
}

async function getUserByName(username: string) {
  let result;
  await db.serialize(async () => {
    result = await db.get('SELECT * FROM user WHERE name = ?', username);
  });
  console.log(result, 'before return');
  return result;
}

async function getAllUsers() {
  return new Promise(async (resolve, reject) => {
    let users: any = [];
    await db.all('SELECT * FROM user', (err: any, rows: any) => {
      if (err) {
        console.error(err);
        users.push(err);
        reject(users);
      } else {
        users.push(...rows);
        resolve(users);
      }
    });
  });
}

module.exports = { createTable, insertUser, getUserByName, getAllUsers };
