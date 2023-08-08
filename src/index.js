const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT 

app.use(express.json());
app.use(taskRouter)
app.use(userRouter);

app.listen(port, () => {
    console.log(`server is up on ${port}`);
});

