
module.exports = (sequelize, DataTypes) => {
    const Category_Item = sequelize.define('category_item', {
        // itemId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        // categoryId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    })

    return Category_Item;
}