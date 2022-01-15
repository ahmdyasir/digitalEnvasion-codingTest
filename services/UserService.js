var CronJob = require("cron").CronJob;
const User = require("../models/user");
const moment = require("moment");
const momenttz = require("moment-timezone");
const https = require('https')
const { birthdayReminder } = require("../queue/Producers");

exports.all = async () => {
  try {
    const data = await User.find();
    let users = [];

    data.forEach((el) => {
      users.push({
        _id: el._id,
        firstName: el.firstName,
        lastName: el.lastName,
        birthdayDate: moment(new Date(el.birthdayDate)).format("YYYY-MM-DD"),
        location: el.location,
      });
    });

    return users;
  } catch (error) {
    throw error;
  }
};

exports.addUser = async (data) => {
  try {
    const places = momenttz.tz.guess(data.birthdayDate)
    const newUser = await new User({
      firstName: data.firstName,
      lastName: data.lastName,
      birthdayDate: moment().format(data.birthdayDate),
      location: data.location,
      browser_location: places,
    })();
    newUser
    .save()
    .then((result) => {
      console.log("Created Product");
    })
    .catch((err) => {
      console.log(err);
    });
    return newUser
  } catch (error) {
    throw error;
  }
};

exports.userDetail = async (prodId) => {
  try {
    const data = await User.findById(prodId);

    return data;
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, { data }) => {
  try {
    const update = await User.findByIdAndUpdate(
      userId,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        birthdayDate: data.birthdayDate,
        location: data.location,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
    return update;
  } catch (error) {
    throw error;
  }
};

exports.birthdayReminder = (pattern) => {
  new CronJob(
    pattern,
    async function () {
      try {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        const notifications = await User.find({
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: "$birthdayDate" }, day] },
              { $eq: [{ $month: "$birthdayDate" }, month] },
            ],
          },
        });
        await Promise.all(
          notifications.map((el) => birthdayReminder.createJob(el).save())
        );
      } catch (error) {
        console.log(error);
      }
    },
    null,
    true,
    "Asia/Jakarta"
  );
};

exports.sendBroadcast = async ({  message }) => {
  try {
    const pesan = message;
    const data = JSON.stringify({
      message: pesan
  })
  
  const options = {
      hostname: "hookb.in",
      port: 443,
      path: "/NOjjzqKqBZse8mNN8bWL",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
  }
  
  const req = https.request(options, (res) => {
      console.log(`status: ${res.statusCode}`);
  });
  
  req.write(data);
  req.end();
  } catch (error) {
    throw error;
  }
};
