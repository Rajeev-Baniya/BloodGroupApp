const router = require("express").Router();
const { body, param, validationResult } = require("express-validator");

const User = require("../models/users");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.send("hello from the main route");
});

const bloodGroups = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

//register_users
router.post(
  "/users/register",
  [
    body("name", "Name is required and should have 3-200 characters")
      .exists()
      .notEmpty()
      .isLength({ min: 3, max: 200 }),
    body("email", "Email is required and should be valid")
      .exists()
      .notEmpty()
      .isEmail()
      .custom(async (inputEmail, { req }) => {
        const user = await User.findOne({ email: inputEmail }).exec();
        if (user) {
          throw new Error("Email already exists. Please try another email");
        }
      }),
    body("phone", "Phone number is required")
      .exists()
      .notEmpty()
      .isNumeric()
      .custom(async (inputPhone, { req }) => {
        const phone = await User.findOne({ phone: inputPhone }).exec();
        if (phone) {
          throw new Error(
            "User with this phone number exist. Please try another number"
          );
        }
        if (inputPhone.length !== 10) {
          throw new Error("Phone number should contain 10 numbers");
        }
      }),
    body("confirm_password", "Confirm password is required")
      .exists()
      .notEmpty(),
    body("district", "You need to input your district")
      .exists()
      .notEmpty()
      .toLowerCase(),
    body("password", "password must be between 8 to 64 characters")
      .exists()
      .notEmpty()
      .isLength({ min: 8, max: 64 })
      .custom(async (inputPassword, { req }) => {
        if (inputPassword !== req.body.confirm_password) {
          throw new Error("Passwords donot match");
        }
      }),
    body("blood_group", "You must enter your blood group")
      .exists()
      .notEmpty()
      .toUpperCase()
      .custom(async (inputBlood, { req }) => {
        if (!bloodGroups.includes(inputBlood)) {
          throw new Error("Invalid blood type");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var allErrors = {};
      errors.errors.forEach(function (err) {
        allErrors[err.param] = err.msg;
      });
      return res.json({
        status: "fail",
        data: allErrors,
      });
    }
    try {
      const user = new User(req.body);
      await user.save();
      res.json({
        status: "success",
        data: {
          user: user,
        },
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }
);

//Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.json({
      status: "success",
      data: {
        users: users,
      },
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error,
    });
  }
});

//get users by district
router.get("/users/district/:district", async (req, res) => {
  try {
    const users = await User.find({ district: req.params.district }).exec();
    res.json({
      status: "success",
      data: {
        users: users,
      },
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error,
    });
  }
});

//get users by blood group
router.get(
  "/users/blood/:blood_group",
  [
    param("blood_group", "invalid blood group")
      .exists()
      .custom(async (inputBlood, { req }) => {
        if (!bloodGroups.includes(inputBlood)) {
          throw new Error("Invalid blood group");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allErrors = {};
      errors.errors.forEach(function (err) {
        allErrors[err.param] = err.msg;
      });

      return res.json({
        status: "fail",
        data: allErrors,
      });
    }
    try {
      const users = await User.find({
        blood_group: req.params.blood_group,
      }).exec();
      return res.json({
        status: "success",
        data: {
          users: users,
        },
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: error,
      });
    }
  }
);

//delete user by their id

router.post(
  "/users/delete/:_id",
  [
    param("_id")
      .exists()
      .custom(async (userId, { req }) => {
        try {
          req.currentUser = await User.findById(
            mongoose.Types.ObjectId(userId)
          ).exec();
          if (!req.currentUser) {
            throw new Error("User not found");
          }
        } catch (error) {
          throw new Error("User not found");
        }
      }),
    body("email", "Email is required and should not be empty")
      .exists()
      .notEmpty()
      .custom(async (inputEmail, { req }) => {
        const email = await User.findOne({ email: inputEmail });
        if (!email) {
          throw new Error("Email doesnot Exist");
        }

        if (email._id != req.params._id) {
          throw new Error("Email is required and it should be valid");
        }
      }),
    body("password", "password is required and should not be empty")
      .exists()
      .custom(async (inputPassword, { req }) => {
        console.log(inputPassword);
        console.log(req.currentUser.password);
        if (inputPassword != req.currentUser.password) {
          throw new Error("Password donot match");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allErrors = {};
      errors.errors.forEach(function (err) {
        allErrors[err.param] = err.msg;
      });
      return res.json({
        status: "fail",
        data: allErrors,
      });
    }

    try {
      await User.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params._id)
      ).exec();
      res.json({
        status: "success",
        data: {},
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: error.msg,
      });
    }
  }
);

//get user by their district and blood group
router.get(
  "/users/both/:district/:blood_group",
  [
    param("blood_group", "blood group is required")
      .exists()
      .custom(async (inputBlood, { req }) => {
        if (!bloodGroups.includes(inputBlood)) {
          throw new Error("Invalid blood group");
        }
      }),
    param("district", "name of district is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allErrors = {};
      errors.errors.forEach(function (err) {
        allErrors[err.param] = err.msg;
      });
      return res.json({
        status: "fail",
        data: allErrors,
      });
    }
    try {
      const users = await User.find({
        district: req.params.district,
        blood_group: req.params.blood_group,
      });
      return res.json({
        status: "success",
        data: {
          users: users,
        },
      });
    } catch (error) {
      return res.json({
        status: "success",
        message: error.msg,
      });
    }
  }
);
module.exports = router;
