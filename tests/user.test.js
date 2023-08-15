//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const bcrypt = require('bcryptjs')
const app = require("../src/app");
const User = require('../src/models/user');
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'Rick Sanchez',
            email: 'ashutoshsaha299@gmail.com',
            password: 'RickSanchez137!'
        })
        .expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion About the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Rick Sanchez',
            email: 'ashutoshsaha299@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('RickSanchez137')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login')
        .send({
            email: 'nonexisting@exaple.com',
            password: 'testingpass!'
        })
        .expect(400)
})

// Should not signup user with invalid name/email/password

test('Should not signup user with invalid name', async () => {
    await request(app).post('/users')
        .send({
            name:"",
            email: 'nonexisting@exaple.com',
            password: 'testingpass!'
        })
        .expect(400)
})
test('Should not signup user with invalid email', async () => {
    await request(app).post('/users')
        .send({
            name: 'ashh',
            email: 'nonexistingexaple.com',
            password: 'testingpass!'
        })
        .expect(400)
})
test('Should not signup user with invalid password', async () => {
    await request(app).post('/users')
        .send({
            name: 'ash',
            email: 'nonexisting@exaple.com',
            password: 'password1234'
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

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        // ".attach" is provided by supertest allowing us to attach files
        .attach('avatar', 'tests/fixtures/ape.jpeg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

})

test('Should update valid user fields', async () => {
    await request(app).patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Professor Albus Dumbledore'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Professor Albus Dumbledore')
})

test('Should not update invalid user fields', async () => {
    await request(app).patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Hogwarts'
        })
        .expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app).patch('/users/me')
        .send({
            name: 'Professor Albus Dumbledore'
        })
        .expect(401)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Dumble Dore')
})

// Should not update user with invalid name/email/password

test('Should not update user with invalid name', async () => {
    await request(app).patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:"",
            email: 'nonexistingexaple.com',
            password: 'testingpass!'
        })
        .expect(400)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Dumble Dore')
})
test('Should not update user with invalid email', async () => {
    await request(app).patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)    
        .send({
            name: 'ashh',
            email: 'nonexistingexaple.com',
            password: 'testingpass!'
        })
        .expect(400)
    const user = await User.findById(userOneId)
    expect(user.email).toBe('ping.doubledore@hogwarts.com')
})
test('Should not update user with invalid password', async () => {
    await request(app).patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'ash',
            email: 'nonexisting@exaple.com',
            password: 'password1234'
        })
        .expect(400)
    const user = await User.findById(userOneId)
    const isMatch = await bcrypt.compare('open.Doubledoor!', user.password)
    expect(isMatch).toEqual(true)
})