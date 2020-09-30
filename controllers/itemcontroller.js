// let express = require('express');
let router = require('express').Router();
let validateSession = require('../middleware/validate-session');
// const log = require('../models/log');
// const user = require('../../../../Javascript-Library/5-node-Server/server/models/user');
const Item = require('../db').import('../models/item');

//Create Items
router.post('/', validateSession, (req, res) => {
    const itemEntry = {
        itemName: req.body.item.itemName,
        quantity: req.body.item.quantity,
        price: req.body.item.price,
        sellerId: req.user.id,
        // userId: req.user.id
    }
    Item.create(itemEntry)
     .then(item => res.status(200).json({
        message: 'item created' 
    }))
     .catch(err => res.status(500).json({error: err}))
});

//Get Items
router.get('/all/',validateSession, (req, res) => {
    let userid = req.user.id
    Item.findAll({
        where: {sellerId: userid}
    })
    .then(item => res.status(200).json({
       item
    }))
    .catch(err => res.status(500).json({error: err}))
});

//Edit Item 
router.put("/:id", validateSession, (req, res) => {
  
    Item.update(req.body.item,  
        {where: {id: req.params.id, sellerId: req.user.id}
    })
    .then((items) => { res.status(200).json({
        message: "Item updated",
        items: items
    })})
    .catch((err) => {res.status(500).json({error: err})})
})

//Delete Item
router.delete("/:id", validateSession, (req, res) => {

    Item.destroy({
        where: {id: req.params.id, sellerId: req.user.id}
    })
    .then(() => {res.status(200).json({message: "item entry removed"})})
    .catch((err) => {res.status(500).json({error: err})})
})

//Get Item By Id
router.get('/:id',validateSession, (req, res) => {
    let itemId = req.params.id;

    Item.findAll({
        where: { id: itemId, sellerId:req.user.id}, include: "seller"
    })
    .then(item => res.status(200).json({
        message: "Item found",
        data: item
    }))
    .catch(err => res.status(500).json("error:" + err))
});

//Get Item by Category Name (Stretch Goal)

module.exports = router;    