const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./models/user");
const stock = require("./models/stock");
const app = express();
const PORT = process.env.PORT || 3000;
const { CronJob } = require("cron");
const { generateRandomData } = require("./utils/data");
const { insertData, updateData } = require("./cron/scheduler");
const dataRouter = require("./routes/liveData")
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);



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


app.use("/", dataRouter);
  

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
