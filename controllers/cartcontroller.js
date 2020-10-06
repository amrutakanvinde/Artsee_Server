let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
// const cart = require('../models/cart');
// const user = require('../models/user');
const Cart = require('../db').import('../models/cart');


//Create Cart
router.post('/', validateSession, (req, res) => {
    const cartEntry = {
        quantity: req.body.cart.quantity,
        userId: req.user.id,
        itemId: req.body.cart.itemId //can use parameter instead
    }
    Cart.create(cartEntry)
     .then(cart => res.status(200).json({
        message: 'cart created'
    }))
     .catch(err => res.status(500).json({error: err}))
});

//Get Cart
router.get('/',validateSession, (req, res) => {
    let userid = req.user.id
    Cart.findAll({
        where: {userId: userid}, include: ["item"]
    })
    .then(cart => res.status(200).json({
       cart
    }))
    .catch(err => res.status(500).json({error: err}))
});

//Edit Cart
router.put("/:id", validateSession, (req, res) => {
  
    Cart.update(req.body.cart,  
        {where: {id: req.params.id, userId: req.user.id}, include: ["user", "item"]
    })
    .then((cart) => { res.status(200).json({
        message: "Item updated",
        cart: cart
    })})
    .catch((err) => {res.status(500).json({error: err})})
})

//Delete Item
router.delete("/:id", validateSession, (req, res) => {

    Cart.destroy({
        where: {id: req.params.id, userId: req.user.id}
    })
    .then(() => {res.status(200).json({message: "cart entry removed"})})
    .catch((err) => {res.status(500).json({error: err})})
})



module.exports = router;  