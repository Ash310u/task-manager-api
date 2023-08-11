//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const app = require("../src/app");
const User = require('../src/models/user');

const userone = {
    name: 'Dumble Dore',
    email:'ping.doubledore@hogwarts.com',
    password:'open.Doubledoor!'
}

beforeEach(async ()=> {
    await User.deleteMany()
    await new User(userone).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name:'Rick Sanchez',
        email:'Rick233Sanchez@gmail.com',
        password:'RickSanchez137!'
    }).expect(201)
}) 

test('Should login existing user', async () => {
    await request(app).post('/users/login').send(userone).expect(200)
})
test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email:'nonexisting@exaple.com',
        password:'testingpass!'
    }).expect(400)
})