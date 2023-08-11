//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const app = require("../src/app");
const User = require('../src/models/user');

beforeEach(async ()=> {
    await User.deleteMany()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name:'Rick Sanchez',
        email:'Rick233Sanchez@gmail.com',
        password:'RickSanchez137!'
    }).expect(201)
}) 