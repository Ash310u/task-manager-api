// I just want Express application before listen to be called, To make request using supertest. And that's why I create app.js and load-in here

const app = require("./app");
const port = process.env.PORT 

app.listen(port, () => {
    console.log(`server is up on ${port}`);
});