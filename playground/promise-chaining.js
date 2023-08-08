require("../src/db/mongoose"); 
const User = require('../src/models/user')

// User.findByIdAndUpdate('64a32e882712f25700d73a55', {age: 1}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
    
// });

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id,{ age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('64a32e882712f25700d73a55',100).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});