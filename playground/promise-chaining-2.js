require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('64b00b6387384aec859974dd').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed:false })
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

const deleteTaskAndCount = async (id, completed) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed})
    return count
}

deleteTaskAndCount('64b00b4c8f5e0aec5cd1f4fa', true).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});