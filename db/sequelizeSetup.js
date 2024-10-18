const fs = require('fs')
const path = require('path')

const cKey = fs.readFileSync(path.resolve('/etc/letsencrypt/live/we-make-team.click/privkey1.pem'))
const cCert = fs.readFileSync(path.resolve('/etc/letsencrypt/live/we-make-team.click/cert1.pem'))
const cCA = fs.readFileSync(path.resolve('/etc/letsencrypt/live/we-make-team.click/chain1.pem'))

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host : process.env.DB_HOST,
    dialect : 'mariadb',
    logging : false,
    dialectOptions: {
        ssl: {
            key: cKey,
            cert: cCert,
            ca: cCA,
            rejectUnauthorized: true
        }
    }
})

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);


sequelize.authenticate()
.then(()=>{console.log(`la connextion à la base de donnée a bien été etablié`)})
.catch((error)=>{console.log(`impossible de se connecter à la base de donnée`, error.message)})


const articleModel = require('../models/articleModel')
const categoryModel = require('../models/categoryModel')
const commentModel = require('../models/commentModel')
const likeModel = require('../models/likeModel')
const userModel = require('../models/userModel')
const roleModel = require('../models/roleModel')
const reportModel = require('../models/reportModel')
const suggestionModel = require('../models/suggestionModel')
const messageModel = require('../models/messageModel');
const messageUserFkModel = require('../models/MessageUserFkModel');

const Article = articleModel(sequelize, DataTypes)
const Category = categoryModel(sequelize, DataTypes)
const Comment = commentModel(sequelize, DataTypes)
const Like = likeModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)
const Role = roleModel(sequelize, DataTypes)
const Report = reportModel(sequelize, DataTypes)
const Suggestion = suggestionModel(sequelize, DataTypes)
const Message = messageModel(sequelize, DataTypes);
const MessageUserFk = messageUserFkModel(sequelize, DataTypes);

Role.hasMany(User)
User.hasMany(Comment)
User.hasMany(Like)
User.hasMany(Article)
User.hasMany(Report)
User.hasMany(Suggestion)
User.belongsTo(Role)
Category.hasMany(Article)
Article.hasMany(Like)
Article.hasMany(Comment)
Article.hasMany(Report)
Article.belongsTo(User)
Article.belongsTo(Category)
Comment.hasMany(Report)
Comment.belongsTo(User)
Comment.belongsTo(Article)
Like.belongsTo(User)
Like.belongsTo(Article)
Report.belongsTo(User)
Report.belongsTo(Comment)
Report.belongsTo(Article)
Suggestion.belongsTo(User)


User.hasMany(MessageUserFk, { foreignKey: 'send_userId' , as: "SentMesaages" });
User.hasMany(MessageUserFk, { foreignKey: 'receive_userId' , as:"ReceivedMessages"});
Message.hasMany(MessageUserFk, { foreignKey: 'messageId'});
MessageUserFk.belongsTo(User, { foreignKey: 'send_userId', as: "Sender"});
MessageUserFk.belongsTo(User, { foreignKey: 'receive_userId', as: "Receiver" });
MessageUserFk.belongsTo(Message, { foreignKey: 'messageId' });


const { setCategories, setUsers, setRoles} = require('./dataSample')

sequelize.sync({force : false})
.then(()=>{
    // setRoles(Role)
    // setUsers(User)
    // setCategories(Category)
})
.catch(()=>{console.log(`il y a une erruer`)})

module.exports =  { sequelize, Article, Category,  Comment, Like, User, Role, Report, Suggestion, Message, MessageUserFk }
