const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./models/user");
const stock = require("./models/stock");
const app = express();
const PORT = process.env.PORT || 3000;
const { CronJob } = require("cron");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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

      // Add the new data entry
      existingData.data.push(newDataEntry);

      // Save the updated document
      existingData
        .save()
        .then(() => console.log("Updated existing stock data"))
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

const addData = async () => {
  const newData = new stock({
    symbol: "AAPL",
    exchange: "NSE",
    currency: "INR",
    name: "Apple",
    description: "Apple Inc",
    interval: "1min",
    data: [
      {
        timestamp: new Date(),
        open: 1500,
        high: 1510,
        low: 1495,
        close: 1505,
        volume: 10000,
      },
    ],
  });
  await newData.save();
};

mongoose
  .connect(
    "mongodb+srv://ankur73tiwari:KdWSeUuTC7z03dny@cluster0.rh2lnkv.mongodb.net/stockTutor?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(async () => {
    console.log(`Database connected `);
    //   addData();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

app.post("/liveData", async (req, res) => {
  const { symbols } = req.body;
  const addJob = new CronJob(
    "*/5 * * * *", // cronTime
    async function () {
      console.log("You will see this message every 5 second");

      await insertData(symbols);
    }, // onTick
    null, // onComplete
    true, // start
    "IST" // timeZone
  );
  const updateJob = new CronJob(
    "*/2 * * * * *", // cronTime
    async function () {
      console.log("You will see this message every 1 second");
      await updateData(symbols);
    }, // onTick
    null, // onComplete
    true, // start
    "IST" // timeZone
  );
});

app.get("/listedStocks", async (req, res) => {
  try {
    // Fetch the top 10 stocks from your database
    const topStocks = await stock.find().limit(10);

    // Iterate through each stock to calculate the difference percentage
    const stocksWithDifference = await Promise.all(
      topStocks.map(async (stock) => {
        const lastTwoData = stock.data.slice(-2); // Get the last two data entries
        const [latestData, previousData] = lastTwoData;

        // Calculate percentage difference
        const closeDiff = latestData.close - previousData.close;
        const percentageDiff = (closeDiff / previousData.close) * 100;

        return {
          name: stock.name,
          symbol: stock.symbol,
          last: latestData.close,
          logo: stock.logo,
          differencePercentage: percentageDiff,
        };
      })
    );

    res.status(200).json(stocksWithDifference);
  } catch (error) {
    console.error("Error fetching listed stocks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

//socket .io

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (symbol) => {
    console.log(`Client joined room for ${symbol}`);
    socket.join(symbol);
  });
  socket.on("leaveRoom", (rooms) => {
      console.log(`Client leaved room for ${rooms}`);
      rooms.map(item => {
          socket.leave(item)
      })
  });

  stock.watch().on("change", (data) => {
    stock.findById(data.documentKey._id).then((updatedStockData) => {
      updatedStockData.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      // Emit updated data to clients in the room for the specific stock symbol
      io.to(updatedStockData.symbol).emit("updatedData", updatedStockData);
    });

    stock
      .find()
      .limit(10)
      .then(async (topStocks) => {
        // Iterate through each stock to calculate the difference percentage
        const stocksWithDifference = await Promise.all(
          topStocks.map(async (stock) => {
            const lastTwoData = stock.data.slice(-2); // Get the last two data entries
            const [latestData, previousData] = lastTwoData;

            // Calculate percentage difference
            const closeDiff = latestData.close - previousData.close;
            const percentageDiff = (closeDiff / previousData.close) * 100;

            return {
              name: stock.name,
              symbol: stock.symbol,
              last: latestData.close,
              logo: stock.logo,
              differencePercentage: percentageDiff,
            };
          })
        );
          io.emit("topStocks", stocksWithDifference);
      });
  });
  // Example event listener
  socket.on("sendData", (symbol) => {
    console.log("SENDDATA", symbol);
    stock.findOne({ symbol: symbol }).then((updatedStockData) => {
        updatedStockData.data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      socket.emit("sendData", updatedStockData);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
