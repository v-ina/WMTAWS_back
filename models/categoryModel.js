module.exports = (sequelize, DataTypes) =>{

    return sequelize.define('category', {
        category : { type : DataTypes.STRING }
        
    },{timestamps : false})
}