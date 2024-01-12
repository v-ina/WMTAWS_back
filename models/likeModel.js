module.exports = (sequelize, DataTypes) =>{
    
    return sequelize.define('like', { }, {updatedAt : false})
}