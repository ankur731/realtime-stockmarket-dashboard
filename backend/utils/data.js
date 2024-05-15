function generateRandomNumber(min, max) {
    return (Math.random() * (max - min) + min).toFixed(4);
}
  
function generateRandomData() {
    const open = generateRandomNumber(166, 167);
    const high = parseFloat(open) + parseFloat(generateRandomNumber(0.05, 0.2));
    const low = open - generateRandomNumber(0.1, 0.2);
    const close = generateRandomNumber(166.5, 166.8);
    const volume = Math.floor(Math.random() * 10000).toString(); // Generating random volume
  
    return {
      open,
      high,
      low,
      close,
      volume,
    };
}
  

module.exports = { generateRandomData}