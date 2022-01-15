const User = require("../models/user");
const userService = require("../services/UserService");
const moment = require('moment-timezone')

exports.getUsers = async (req, res, next) => {
  try {
    const data = await userService.all();
    req.data = res.render("user/list", {
      data: data,
      pageTitle: "User List",
      path: "/",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAddUser = async (req, res, next) => {
  await res.render("user/edit-user", {
    pageTitle: "Add User",
    path: "/add-user",
    editing: false,
  });
};

exports.postAddUser = async (req, res, next) => {
  try{
  const data = req.body
  const places = moment.tz.guess(data.birthdayDate)
  const product = new User({
    firstName: data.firstName,
    lastName: data.lastName,
    birthdayDate: moment().format(data.birthdayDate),
    location: data.location,
    browser_location: places,
  });
  await product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  } catch (error){
    throw (error)
  }
};

exports.getEditUser = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.userId;
    const data = await userService.userDetail(prodId);
    req.data = res.render("user/edit-user", {
      pageTitle: "Edit User",
      path: "/edit-user",
      editing: editMode,
      user: data,
      date: moment(new Date(data.birthdayDate)).format("YYYY-MM-DD"),
    });
  } catch (error) {
    throw error
  }
};

exports.postEditUser = async (req, res, next) => {
  try{
    const data = req.body

    req.data = await userService.updateUser(req.body.userId, {data})
    return res.redirect('/')
  } catch (error){
    throw error;
  }
};
