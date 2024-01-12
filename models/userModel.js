module.exports = (sequelize, DataTypes) =>{

    return sequelize.define('user', {
        username : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : {
                args : true,
                msg : 'ce nom est deja pris.'
            },
            validate : {
                len : {
                    args : [3],
                    msg : 'nom doit etre plus de 3mots'
                },
                notEmpty : {
                    args : true,
                    msg : 'nom doit pas etre vide.'
                },
                noSpace(input){
                    const newInput = `${input.split(' ')}`
                    if(newInput !== input){
                        throw new Error(`impossible de mettre une espace pour le nom`)
                    }
                }
            }
        },
        password :  {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                notEmpty : {
                    args : true,
                    msg : 'nom doit pas etre vide.'
                }
            }
        }, 
        email : {            
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                isEmail : {
                    args : true,
                    msg : 'email cannot be null / need correct email form'
                }
            }
        },
        firstname : {type : DataTypes.STRING},
        birthdate : {type: DataTypes.DATE},
        discordId : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : {
                args : true,
                msg : 'ce discord-id est deja pris.'
            }
        },
        introduction : { type : DataTypes.TEXT },
        photo : { type : DataTypes.STRING },
        roleId : { type : DataTypes.INTEGER }
        
    },{timestamps : false, 
        onDelete: 'CASCADE',
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
    }})
}