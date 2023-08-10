const { calculatedTip, fahrenheitToCelsius, celsiusToFahrenheit } = require("../src/tempMath")

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