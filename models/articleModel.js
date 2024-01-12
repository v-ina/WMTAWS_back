module.exports = (sequelize, DataTypes) =>{
    
    return sequelize.define('article', {
        title : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : {
                args : true,
                msg : 'ce titre est deja pris.'
            },
            validate : {
                notEmpty : {
                    args : true,
                    msg : 'titre doit pas etre vide.'
                }
            }
        },
        numOfMember : {type : DataTypes.INTEGER},
        text : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        attachment : { type : DataTypes.JSON}

    }, {updatedAt : false, onDelete: 'CASCADE'})
}