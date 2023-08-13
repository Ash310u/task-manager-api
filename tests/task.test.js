//  GET access to our Express application but I don't want listen to be called thats why we create "app.js"
// I just want Express application before listen to be called. To make request using supertest.

const request = require('supertest')
const Task = require('../src/models/task');
const app = require('../src/app');
const { setupDatabase, userOne, userOneId } = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should create task for user', async () => {

})