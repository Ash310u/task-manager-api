const { calculatedTip } = require("../src/tempMath")

test(`Should calculate total with tip`, () => {
    const total = calculatedTip(10, .2)
    expect(total).toBe(12)
})

test('Should calculate total with default tip', () => {
    const total = calculatedTip(100)
    expect(total).toBe(130)
})

