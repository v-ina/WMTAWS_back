module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MessageUserFk', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        messageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'messages',
                key: 'id'
            }
        },
        send_userId: { 
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        receive_userId: { 
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        tableName: 'message_user_fk',
        timestamps: false,
        onDelete: 'CASCADE'
    });
};
