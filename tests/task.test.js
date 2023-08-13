//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'testing task case one',
        })
        .expect(201)

    // Assert that the database was changed correctly
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})