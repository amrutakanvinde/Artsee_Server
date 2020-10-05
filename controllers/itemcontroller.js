// let express = require('express');
let router = require("express").Router();
let validateSession = require("../middleware/validate-session");
const Item = require("../db").import("../models/item");
const CategoryItem = require("../db").import("../models/category_item");
const User = require("../db").import("../models/user");

checkUserRole = (id, res) => {
  User.findOne({
    where: { id: id },
  })
    .then((user) => {
      if (user.role === "buyer") {
        //only seller and admin have access
        res.status(401).json({ error: "Not Authorized" });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
};

//Create Items
//only seller/admin can create items
router.post("/", validateSession, (req, res) => {
  checkUserRole(req.user.id, res);
  const itemEntry = {
    itemName: req.body.item.itemName,
    quantity: req.body.item.quantity,
    price: req.body.item.price,
    sellerId: req.user.id,
    itemImage: req.body.item.itemImage,
    itemDescription: req.body.item.itemDescription
    // userId: req.user.id
  };
  console.log("************", itemEntry);
  Item.create(itemEntry)
    .then((item) => {
      let category_ids = req.body.item.category_ids;
      category_ids.forEach((category_id) => {
        CategoryItem.create({ categoryId: category_id, itemId: item.id });
        // .catch(err => { console.log("LLALLA");
        //     throw err})
      });
    })
    .then(() =>
      res.status(200).json({
        message: "item created",
      })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//Get Items
router.get("/all", validateSession, (req, res) => {
  // let userid = req.user.id;
  Item.findAll({
    // where: { sellerId: userid },
    // include: "seller",
  })
    .then((item) =>
      res.status(200).json({
        item,
      })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

//Edit Item
//only seller/admin can edit items
router.put("/:id", validateSession, (req, res) => {
  checkUserRole(req.user.id, res);
  Item.update(req.body.item, {
    where: { id: req.params.id, sellerId: req.user.id },
  })
    .then((items) => {
      res.status(200).json({
        message: "Item updated",
        items: items,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//Delete Item
//only seller/admin can delete items
router.delete("/:id", validateSession, (req, res) => {
  checkUserRole(req.user.id, res);

  CategoryItem.destroy({
    where: { itemId: req.params.id },
  })
    .then(() => {
      Item.destroy({
        where: { id: req.params.id, sellerId: req.user.id },
      })
        .then(() => {
          res.status(200).json({ message: "item entry removed" });
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
//Write code for deleting items from category_items

//Get Item By Id
router.get("/:id", validateSession, (req, res) => {
  let itemId = req.params.id;

  Item.findAll({
    where: { id: itemId, sellerId: req.user.id },
    include: "seller",
  })
    .then((item) =>
      res.status(200).json({
        message: "Item found",
        data: item,
      })
    )
    .catch((err) => res.status(500).json("error:" + err));
});

//Get Item by Category Name (Stretch Goal)

module.exports = router;
