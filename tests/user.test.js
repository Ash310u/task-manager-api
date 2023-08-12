//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require("../src/app");
const User = require('../src/models/user');
const auth = require('../src/middleware/auth');

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Dumble Dore',
    email: 'ping.doubledore@hogwarts.com',
    password: 'open.Doubledoor!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users')
        .send({
            name: 'Rick Sanchez',
            email: 'Rick233Sanchez@gmail.com',
            password: 'RickSanchez137!'
        })
        .expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login')
        .send({
            email: 'nonexisting@exaple.com',
            password: 'testingpass!'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app).get('/users/me')
        // using ".set" method for setting header we are using "Authorization"
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})