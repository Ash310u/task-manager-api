// I just want Express application before listen to be called, To make request using supertest. And that's why I create app.js and export it.

const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(taskRouter)
app.use(userRouter);

module.exports = app