const { calculatedTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require("../src/tempMath")

test(`Should calculate total with tip`, () => {
    const total = calculatedTip(10, .2)
    expect(total).toBe(12)
})

test('Should calculate total with default tip', () => {
    const total = calculatedTip(100)
    expect(total).toBe(130)
})

test(`F => C`, () => {
    const Cel = fahrenheitToCelsius(32)
    expect(Cel).toBe(0)
})

test(`C => F`, () => {
    const Far = celsiusToFahrenheit(0)
    expect(Far).toBe(32)
})

// test(`Async test demo`, (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2) // Assertion
//         done()
//     }, 2000);
// })


test(`Should add two numbers`, (done) => {
    add(1, 2).then((result) => {
        expect(result).toBe(3)
        done()
    })
})

test(`Should add two numbers async/await`, async () => {
    const result = await add(10, 20)
    expect(result).toBe(30)
})