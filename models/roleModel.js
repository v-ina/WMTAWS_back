module.exports = (sequelize, DataTypes) =>{

    return sequelize.define('role', {
        label : { type : DataTypes.STRING }
        
    },{timestamps : false})
}