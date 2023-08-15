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

// Should fetch page of tasks

test('Should fetch page of task', async () => {
    const response = await request(app).get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body).toEqual(expect.any(Array))
})

test('Should fetch user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should fetch user task by id', async () => {
    const response = await request(app).get(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task.owner).toEqual(userOne._id)
})

test('Should not fetch other users task by id', async () => {
    const response = await request(app).get(`/tasks/${taskThree._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)

    expect(response.body._id).toEqual(undefined)
})

test('Should not fetch user task by id if unauthenticated', async () => {
    const response = await request(app).get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)

    expect(response.body._id).toEqual(undefined)
})

test('Should fetch only completed tasks', async () => {
    const response = await request(app).get(`/tasks?sortBy=createdAt_desc&completed=true`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = response.body
    tasks.forEach(task => {
        if (!task.completed === true) {
            throw new Error('its showing incompleted values')
        }
    });
})

test('Should fetch only incomplete tasks', async () => {
    const response = await request(app).get(`/tasks?sortBy=createdAt_desc&completed=false`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = response.body
    tasks.forEach(task => {
        if (!task.completed === false) {
            throw new Error('its showing completed values')
        }
    });
})

// Should sort tasks by /createdAt/updatedAt

test('Should sort tasks by createdAt', async () => {
    await request(app).get(`/tasks?sortBy=createdAt_desc`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})

test('Should sort tasks by updatedAt', async () => {
    await request(app).get(`/tasks?sortBy=updatedAt_desc`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})

test('Should delete user task', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})
test('Should not delete task if unauthenticated', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test('Should not delete other users task', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
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

test('Should not update other users task', async () => {
    const response = await request(app).patch(`/tasks/${taskThree._id}`)
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:" try to uodate other users task ",
            completed:true
        })
        .expect(404)

    expect(response.body._id).toEqual(undefined)    
})
