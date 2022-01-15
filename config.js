const config = require('./.config');
exports.getRedis = () => config.redis;