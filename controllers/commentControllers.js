const { Article, Category,  Comment, User } = require('../db/sequelizeSetup')
const { ValidationError, UniqueConstraintError } = require('sequelize')


const findAllComments = (req, res) => {
    Comment.findAll({include : [{model : Article, include : [User,Category,Comment]},User]})
    .then((result)=>{ res.json({message : `il y a ${result.length} Comments`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const findCommentByPk = (req, res) => {
    Comment.findByPk(req.params.id, {include : User})
    .then((result)=>{
        if(!result){ 
            return res.status(404).json({message : `on peut pas trouver Comment n° ${req.params.id}`})
        }
        res.json({message : `c'est l'Comment id n° ${req.params.id}`, data : result})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const createComment = (req, res) => {
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        return Comment.create({...req.body, userId : afterFindOne.id})
        .then((result)=>{res.json({message : `on a bien cree un nouveau Comment`, data : result})})
    })
    .catch((error)=>{ 
        if(error instanceof ValidationError){
            return res.json({message : error.message})
        }
        res.status(500).json({message : `il y a une erreur`, error : error.message})
    })
}


const updateComment = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver Comment n° ${req.params.id}`})
    }
    Comment.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.update({text : req.body.text})
        .then((afterUpdate)=>{res.json({message : `on a bien fait un mis a jour d'Comment n° ${req.params.id}`, data : afterUpdate})})
    })
    .catch((error)=>{ 
        if(error instanceof ValidationError || error instanceof UniqueConstraintError){
            return res.json({message : error.message})
        }
        res.status(500).json({message : `il y a une erreur`, error : error.message})
    })
}


const deleteComment = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver Comment n° ${req.params.id}`})
    }
    Comment.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.destroy()
        .then(()=>{res.json({message : `on a bien supprime Comment n° ${req.params.id}`, data : afterFindByPk})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findAllComments, findCommentByPk, createComment, updateComment, deleteComment }