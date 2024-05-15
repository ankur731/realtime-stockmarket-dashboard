const stock = require("../models/stock");
const { generateRandomData } = require("../utils/data");

async function insertData(symbols) {
    try {
      for (const symbol of symbols) {
        const existingData = await stock.findOne({ symbol });
  
        if (!existingData) {
          return console.error("No existing data found");
        }
        existingData.data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
  
        const latestDataEntry = existingData.data[existingData.data.length - 1];
  
        // Generate random data
        const { low, high, open, close, volume } = generateRandomData();
  
        const timestamp = new Date(latestDataEntry.timestamp);
  
        // Add 5 minutes to the timestamp
        timestamp.setMinutes(timestamp.getMinutes() + 5);
        // Create a new data entry
        const newDataEntry = {
          timestamp: timestamp,
          open,
          high,
          low,
          close,
          volume,
          };
          StockData.findOneAndUpdate(
              { symbol },
              {
                $push: {
                  data: {
                    timestamp: new Date(), // Use current timestamp
                    ...generateRandomData(),
                  },
                },
              }
            ).then(() => console.log("Updated existing stock data"))
          .catch((err) =>
            console.error("Error updating existing stock data:", err)
          );
      }
    } catch (err) {
      console.log("error in adding data");
    }
}
  

async function updateData(symbols) {
    try {
      for (const symbol of symbols) {
        const existingData = await stock.findOne({ symbol: symbol });
  
        if (!existingData) {
          return console.error("No existing data found");
        }
        // existingData.data.sort(
        //   (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        // );
  
        // Get the latest data entry
        const latestDataEntry = existingData.data[existingData.data.length - 1];
  
        // Generate new data
        const newData = generateRandomData();
  
        // Set the new data in the latest entry
        latestDataEntry.open = newData.open;
        latestDataEntry.high = newData.high;
        latestDataEntry.low = newData.low;
        latestDataEntry.close = newData.close;
        latestDataEntry.volume = newData.volume;
  
        // Save the updated document
        await existingData.save();
        console.log("Data updated");
      }
    } catch (error) {
      console.error("Error adding new data to existing stock:", error);
    }
  }
  

module.exports = {insertData, updateData}
  