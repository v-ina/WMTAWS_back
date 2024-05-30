module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        content: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'messages',
        timestamps: true,
        onDelete: 'CASCADE'
    });
};
