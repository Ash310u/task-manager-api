const calculatedTip = (total,TIPpercent) => {
    const tip = total * TIPpercent 
    return total + tip
}

module.exports = {
    calculatedTip
}