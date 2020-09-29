require("dotenv").config();
const router = require("express").Router();
const User = require("../db").import("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get('/practice', (req, res) => {
    res.send('This is a practice route');
})


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
        } else if(!req.body.user.email.match(reg)){
          console.log("2");
          res.status(510).json({ error: "Invalid Email address" });
        } else if(req.body.user.password.length < 4 || req.body.user.password.length >16){
          console.log("3");
          res.status(401).json({ error: "Your password must be between 5 and 16 characters" });
        } else {
          console.log("4");
          User.create({
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            userName: req.body.user.userName,
            email: req.body.user.email,
            password: bcrypt.hashSync(req.body.user.password, 13),
            type: req.body.user.type,
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

module.exports = router;