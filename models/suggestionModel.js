module.exports = (sequelize, DataTypes) =>{

    return sequelize.define('suggestion', { 
        text : {
            type : DataTypes.TEXT,
            allowNull : false,
        }
        
    }, {updatedAt : false})
}