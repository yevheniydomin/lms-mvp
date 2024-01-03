const express = require('express');
import * as path from 'path';
const { createTable, insertUser, getUserByName, getAllUsers } = require('./db/sqlite');
import * as fs from 'fs';

const app = express();
const port = 80;
const indexPath = path.join(__dirname, 'public/index.html');

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: any, res: any) => {
  res.sendFile(indexPath);
});

app.get('/users', (req: any, res: any) => {
  getAllUsers().then((users: any[]) => {
    res.send(users);
  });
});

createTable();

app.post('/user', async (req: any, res: any) => {
  insertUser(req.body.fName);
  res.send(`200 OK!`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
