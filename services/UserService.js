var CronJob = require("cron").CronJob;
const User = require("../models/user");
const moment = require("moment");
const momenttz = require("moment-timezone");
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
        var year = dateObj.getUTCFullYear();
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
