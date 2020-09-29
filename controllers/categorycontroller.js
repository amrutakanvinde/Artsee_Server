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




module.exports = router;