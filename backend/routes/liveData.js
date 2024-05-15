const router = require("express").Router();
const { insertData, updateData } = require("../cron/scheduler");
const { CronJob } = require("cron");
const stock = require("../models/stock");


const cronJobs = []; // O
  


router.post("/stopLiveData", (req, res) => {
    const { symbols } = req.body;
    console.log("stopping------------")
    // Iterate over the stored cron jobs and stop them
    cronJobs.forEach((job) => {
        console.log(job)
      job.stop()
      console.log(`Cron job ${job} stopped`);
    });
  
    res.status(200).send("Server stopped");
});
  
router.post("/liveData", async (req, res) => {
    const { symbols } = req.body;
    const addJob = new CronJob( 
      "*/10 * * * * *", // cronTime
      async function () {
        console.log("You will see this message every 5 minute");
  
        await insertData(symbols);
        }, // onTick
      null, // onComplete
      true, // start
      "IST" // timeZone
      );
      
    const updateJob = new CronJob(
      "*/2 * * * * *", // cronTime
      async function () {
        console.log("You will see this message every 2 second");
        await updateData(symbols);
      }, // onTick
      null, // onComplete
      true, // start
      "IST" // timeZone
      );
      
       // Store the cron jobs with unique keys
    cronJobs.push(addJob)
      cronJobs.push(updateJob)
      res.status(200).send("Server is live");
  });

router.get("/listedStocks", async (req, res) => {
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
  

module.exports = router
  