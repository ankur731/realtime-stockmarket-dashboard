const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the entire document
const StockDataSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    enum: ["1min", "5min", "15min", "30min", "1hour"], // Adjust as needed
    default: "1min",
  },
  data: [
    {
      timestamp: {
        type: Date,
        required: true,
      },
      open: {
        type: String,
        required: true,
      },
      high: {
        type: String,
        required: true,
      },
      low: {
        type: String,
        required: true,
      },
      close: {
        type: String,
        required: true,
      },
      volume: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create and export the Mongoose model
const StockData = mongoose.model("StockData", StockDataSchema);

module.exports = StockData;
