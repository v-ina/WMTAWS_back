const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('project_final_alpha', 'root', '', {
    host : 'localhost',
    dialect : 'mariadb',
    logging : false
})


sequelize.authenticate()
.then(()=>{console.log(`la connextion à la base de donnée a bien été etablié`)})
.catch((error)=>{console.log(`impossible de se connecter à la base de donnée`, error)})


const articleModel = require('../models/articleModel')
const categoryModel = require('../models/categoryModel')
const commentModel = require('../models/commentModel')
const likeModel = require('../models/likeModel')
const userModel = require('../models/userModel')
const roleModel = require('../models/roleModel')
const reportModel = require('../models/reportModel')
const suggestionModel = require('../models/suggestionModel')

const Article = articleModel(sequelize, DataTypes)
const Category = categoryModel(sequelize, DataTypes)
const Comment = commentModel(sequelize, DataTypes)
const Like = likeModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)
const Role = roleModel(sequelize, DataTypes)
const Report = reportModel(sequelize, DataTypes)
const Suggestion = suggestionModel(sequelize, DataTypes)

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


const { setCategories, setUsers, setRoles} = require('./dataSample')

sequelize.sync({force : false})
.then(()=>{
    // setRoles(Role)
    // setUsers(User)
    // setCategories(Category)
})
.catch(()=>{console.log(`il y a une erruer`)})

module.exports =  { sequelize, Article, Category,  Comment, Like, User, Role, Report, Suggestion }
