//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db');

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

// Should not create task with invalid description/completed

test('Should not create task with invalid description', async () => {
    const response = await request(app).post('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:"",
            completed:true
        })
        .expect(400)
    
    expect(response.body._id).toEqual(undefined)
})

test('Should not create task with invalid completed', async () => {
    const response = await request(app).post('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:" invalid completed test ",
            completed:"completed testing"
        })
        .expect(400)
    
    expect(response.body._id).toEqual(undefined)
})

test('Should fetch user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

// Should not update task with invalid description/completed

test('Should not update task with invalid description', async () => {
    const response = await request(app).patch(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:"",
            completed:true
        })
        .expect(500)
    
    expect(response.body.description).not.toBe(taskOne.description)
})

test('Should not update task with invalid completed', async () => {
    const response = await request(app).patch(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:" invalid completed test ",
            completed:"completed testing"
        })
        .expect(500)

    expect(response.body.completed).not.toBe(taskOne.completed)
})