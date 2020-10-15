// let express = require('express');
let router = require("express").Router();
let validateSession = require("../middleware/validate-session");
const Item = require("../db").import("../models/item");
const CategoryItem = require("../db").import("../models/category_item");
const User = require("../db").import("../models/user");

//Get Category Items by item Id
router.get("/:id", validateSession, (req, res) => {
    // let userid = req.user.id;
    CategoryItem.findAll({
      where: { itemId: req.params.id }
    })
      .then((item) =>
        res.status(200).json({
          item,
        })
      )
      .catch((err) => res.status(500).json({ error: err }));
  });

  module.exports = router;