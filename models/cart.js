
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('cart', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        // itemId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    })

    return Cart;
}