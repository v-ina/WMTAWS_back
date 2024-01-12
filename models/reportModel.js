module.exports = (sequelize, DataTypes) =>{
    
    return sequelize.define('report', { }, {updatedAt : false})
}