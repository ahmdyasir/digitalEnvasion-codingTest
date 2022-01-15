const Config = require("../config");
const Queue = require("bee-queue");
const axios = require("axios");
const moment = require("moment");
const userService = require('./../services/UserService')
const momentTz = require("moment-timezone");

const queue = new Queue("birthday-reminder", {
  redis: Config.getRedis(),
  isWorker: true,
  sendEvents: false,
  storeJobs: false,
  ensureScripts: true,
  activateDelayedJobs: true,
  removeOnSuccess: true,
  removeOnFailure: true,
});

queue.on("error", (err) => {
  console.log(`report:: job error : ${err.message}`);
});

queue.on("succeeded", async (job) => {});

queue.on("failed", async (job, err) => {
  console.log(
    `broadcast birthday message failed with error: ${err.message}`
  );
});

queue.on("ready", () => {
  console.log("Broadcast Birthday Queue worker ready");
  queue.process(async (job) => {
    try {
      const data = job.data;
      console.log(momentTz.tz.guess(data.browser_location))
      const locale = momentTz.tz(data.browser_location).format("HH:mm");
      const full_name = data.firstName + ' ' + data.lastName
      if(locale =="22:04"){
        const pesan = `Hey, ${full_name} it's your birthday`
        userService.sendBroadcast({
         message: pesan
        })
      }else{
        
      }
     
    } catch (error) {
      console.log(error);
    }
  });
});

queue.checkStalledJobs(5000, (err, numStalled) => {
  if (numStalled > 0) console.log("Checked stalled jobs", numStalled);
});

const TIMEOUT = 30 * 1000;

process.on("uncaughtException", async () => {
  try {
    console.log("bee-queue  shut down");
    await queue.close(TIMEOUT);
  } catch (err) {
    console.error("bee-queue failed to shut down gracefully", err);
  }
  process.exit(1);
});
