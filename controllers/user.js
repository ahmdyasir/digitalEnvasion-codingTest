const User = require("../models/user");
const userService = require("../services/UserService");
const moment = require('moment-timezone')

exports.getUsers = async (req, res, next) => {
  try {
    const data = await userService.all();
    req.data = res.render("admin/list", {
      data: data,
      pageTitle: "User List",
      path: "/admin/",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add User",
    path: "/admin/add-user",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthdayDate = req.body.birthdayDate;
  const location = req.body.location;
  // const dateTime = moment(birthdayDate).toDate();
  const places = moment.tz.guess(birthdayDate)
  const product = new User({
    firstName: firstName,
    lastName: lastName,
    birthdayDate: moment().format(birthdayDate),
    location: location,
    browser_location: places,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/add-user");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.userId;
    const data = await userService.userDetail(prodId);
    req.data = res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-user",
      editing: editMode,
      user: data,
      date: moment(new Date(data.birthdayDate)).format("YYYY-MM-DD"),
    });
  } catch (error) {
    throw error
  }
};

// exports.postEditProduct = (req, res, next) => {
//   const userId = req.body.userId;
//   const firstName = req.body.firstName;
//   console.log(firstName)
//   const lastName = req.body.lastName;
//   const birthdayDate = req.body.birthdayDate;
//   const location = req.body.location;
//   User.findById(userId)
//     .then(product => {
//       product.firstName = firstName;
//       product.lastName = lastName;
//       product.birthdayDate = birthdayDate;
//       product.location = location;
//       return product.save();
//     })
//     .then(result => {
//       console.log('UPDATED PRODUCT!');
//       res.redirect('/admin/');
//     })
//     .catch(err => console.log(err));
// };

exports.postEditProduct = async (req, res, next) => {
  try{
    const data = req.body

    req.data = await userService.updateUser(req.body.userId, {data})
    return res.redirect('/admin/')
  } catch (error){
    throw error;
  }
};
