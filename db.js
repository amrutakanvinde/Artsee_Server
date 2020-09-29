require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, { 
    dialect: 'postgres'
});

sequelize.authenticate().then(
    function() {
        console.log('Connected to artsee database');
    },
    function(err){
        console.log(err);
    }
);

User = sequelize.import('./models/user');
Cart = sequelize.import('./models/cart');
Item = sequelize.import('./models/item');
Category = sequelize.import('./models/category');
Category_Items = sequelize.import('./models/category_items');


// User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsTo(Item);

// User.hasMany(Items);
Item.belongsTo(User, {as: 'seller'});

Category_Items.belongsTo(Item);
Category_Items.belongsTo(Category);


module.exports = sequelize; 