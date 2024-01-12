module.exports = (sequelize, DataTypes) =>{

    return sequelize.define('comment', {
        text : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notEmpty : {
                    args : true,
                    msg : 'nom doit pas etre vide.'
                }
            }
        }
        
    }, {updatedAt : false})
}