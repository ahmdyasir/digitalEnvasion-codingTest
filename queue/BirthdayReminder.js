const Config = require("../.config");
const Queue = require("bee-queue");
const moment = require('moment')
const momentTz = require('moment-timezone')

const queue = new Queue("birthday-reminder", {
  redis: Config.getRedis(),
  isWorker: true,
  sendEvents: false,
  storeJobs: false,
  ensureScripts: true,
  activateDelayedJobs: true,
  removeOnSuccess: true,
  removeOnFailure: true,
  redisScanCount: 100,
});

queue.on("error", (err) => {
  console.log(`report:: job error : ${err.message}`);
});

queue.on("succeeded", async (job) => {});

queue.on("failed", async (job, err) => {
  console.log(
    `broadcast customer (${job.data.phone}):: failed with error: ${err.message}`
  );
});

queue.on("ready", () => {
  console.log("Broadcast Queue worker ready");
  queue.process(async (job) => {
    try {
      const data = job.data;
      console.log("processing ", data.phone);


      // PancakeService.sendBroadcast({
      //   senderPhone: Config.getPSTCSPancake().senderPhone,
      //   customerPhone: data.phone.replace(/^(0|\+62)/g, "62"),
      //   message: data.message,
      //   image: data.image
      // })
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
