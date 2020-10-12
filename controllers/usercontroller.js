require("dotenv").config();
const router = require("express").Router();
const User = require("../db").import("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateSession = require("../middleware/validate-session");

router.post("/signup", function (req, res) {
  let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  User.findAll({
    where: { email: req.body.user.email },
  })
    .then((user) => {
      console.log(user);

      if (user.length > 0) {
        console.log("1");
        res.status(409).json({ error: "User already exists" });
      } else if (!req.body.user.email.match(reg)) {
        console.log("2");
        res.status(510).json({ error: "Invalid Email address" });
      } else if (
        req.body.user.password.length < 4 ||
        req.body.user.password.length > 16
      ) {
        console.log("3");
        res
          .status(401)
          .json({ error: "Your password must be between 5 and 16 characters" });
      } else {
        console.log("4");
        User.create({
          firstName: req.body.user.firstName,
          lastName: req.body.user.lastName,
          userName: req.body.user.userName,
          email: req.body.user.email,
          password: bcrypt.hashSync(req.body.user.password, 13),
          role: req.body.user.role,
        })
          .then(function createSuccess(user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24,
            });
            res.json({
              user: user,
              message: "User successfully created",
              sessionToken: token,
            });
          })
          .catch((err) => res.status(500).json({ error: err }));
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/login", function (req, res) {
  User.findOne({
    where: {
      email: req.body.user.email,
    },
  })
    .then(function loginSuccess(user) {
      if (user) {
        bcrypt.compare(req.body.user.password, user.password, function (
          err,
          matches
        ) {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24,
            });

            res.status(200).json({
              user: user,
              message: "User successfully logged in",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Login Failed" });
          }
        });
      } else {
        res.status(500).json({ error: "User does not exist" });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//Get all Users
router.get("/all", validateSession, (req, res) => {
  if (req.user.role.toLowerCase() === "admin") {
    User.findAll()
      .then((users) =>
        res.status(200).json({
          users,
        })
      )
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.status(402).json({ error: "Only admin can acces all users" });
  }
});

//Get current User
router.get("/", validateSession, (req, res) => {
  User.findOne({ where: { id: req.user.id } })
    .then((users) => res.status(200).json({ users }))
    .catch((err) => res.status(500).json({ error: err }));
});

//Edit USer
router.put("/:id", validateSession, (req, res) => {
  // console.log(`Param Id ${req.params.id} and user id ${req.user.id} and role ${req.user.role}`)
  if (
    parseInt(req.params.id) === req.user.id ||
    req.user.role.toLowerCase() === "admin"
  ) {
    User.update(req.body.user, {
      where: {
        id: req.params.id,
      },
    })
      .then((user) => {
        res.status(200).json({
          message: `${user} User updated`,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(401).json({ error: "Not Authorized" });
  }
});

//Delete User
router.delete("/:id", validateSession, (req, res) => {
  if (
    parseInt(req.params.id) === req.user.id ||
    req.user.role.toLowerCase() === "admin"
  ) {
    User.destroy({
      where: { id: req.params.id },
    })
      .then(() => {
        res.status(200).json({ message: "user removed" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(401).json({ error: "Not Authorized" });
  }
});

module.exports = router;
