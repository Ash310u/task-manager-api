const { calculatedTip } = require("../src/tempMath")

test(`Should calculate total with tip`, () => {
    const total = calculatedTip(10, .2)

    if (total !== 12) {
        throw new Error('Total tip should be 12. got ' + total)
    }
    
}) 