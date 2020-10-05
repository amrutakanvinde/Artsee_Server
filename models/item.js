
module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemDescription:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        itemImage: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // shippingPrice: {
        //     type: DataTypes.DOUBLE,
        //     allowNull: true
        // },
        // sellerId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    })
    return Item;
}