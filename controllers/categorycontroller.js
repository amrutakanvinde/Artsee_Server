let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
const Category = require('../db').import('../models/category');

//Create Category
router.post('/', validateSession, (req, res) => {
    const categoryEntry = {
        categoryName: req.body.category.categoryName
    }
    Category.create(categoryEntry)
     .then(category => res.status(200).json({
        message: 'Category created'
    }))
     .catch(err => res.status(500).json({error: err}))
});


//Get Category
router.get('/',validateSession, (req, res) => {
    let userid = req.user.id
    Category.findAll({
        // where: {userId: userid}
    })
    .then(category => res.status(200).json({category}))
    .catch(err => res.status(500).json({error: err}))
});

//Edit Category
router.put("/:id", validateSession, (req, res) => {
  
    Category.update(req.body.category,  
        {where: {id: req.params.id}//, sellerId: req.user.id}
    })
    .then((items) => { res.status(200).json(items)})
    .catch((err) => {res.status(500).json({error: err})})
})

//Delete Item
router.delete("/:id", validateSession, (req, res) => {

    Category.destroy({
        where: {id: req.params.id}//, sellerId: req.user.id}
    })
    .then(() => {res.status(200).json({message: "category entry removed"})})
    .catch((err) => {res.status(500).json({error: err})})
})



module.exports = router;