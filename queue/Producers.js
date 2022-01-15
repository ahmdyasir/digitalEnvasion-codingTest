const Queue = require('bee-queue');
const redis = require('redis');
const Config = require('../.config');

const redisConfig = Config.redis
const sharedConfig = {
  getEvents: false,
  isWorker: false,
  redis: redis.createClient(redisConfig.port, redisConfig.host),
  activateDelayedJobs: true,
};

exports.birthdayReminder = new Queue('birthday-reminder', sharedConfig);


