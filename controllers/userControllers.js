const { User } = require('../db/sequelizeSetup')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const bcrypt = require('bcrypt')


const findAllUsers = (req, res) => {
    User.findAll()
    .then((result)=>{ res.json({message : `il y a ${result.length} utilisateur`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const findUserByPk = (req, res) => {
    User.findByPk(req.params.id)
    .then((result)=>{
        if(!result){
            return res.status(404).json({message : `on peut pas trouver utilisateur n° ${req.params.id}`})
        }
        res.json({message : `c'est l'utilisateur id n° ${req.params.id}`, data : result})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then((hashResult)=>{
        User.create({...req.body, password: hashResult, roleId : 3})
        .then((result)=>{res.json({message : `on a bien cree un nouveau utilisateur`, data : result})})
        .catch((error)=>{ 
            if(error instanceof ValidationError || error instanceof UniqueConstraintError){
                return res.status(501).json({message : error.message})
            }
            res.status(502).json({message : `il y a une erreur`, error : error.message})
        })
    })
    .catch((error)=>{ res.status(503).json({message : `il y a une erreur a hasher`, error : error.message})})
}


const updateUser = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver utilisateur n° ${req.params.id}`})
    }
    User.scope('withPassword').findByPk(req.params.id)
    .then((afterFindByPk)=>{
        if(req.body.password){
            return bcrypt.hash(req.body.password, 10)
            .then((hash)=>{
                req.body.password = hash
                req.body.username = afterFindByPk.username 
                if(!req.file){
                    return afterFindByPk.update(req.body)
                    .then((afterUpdate)=>{res.json({message : `on a bien fait un mis a jour d'utilisateur n° ${req.params.id}`, data : afterUpdate})})
                } else {
                    return afterFindByPk.update({...req.body, photo: `${req.protocol}://${req.get('host')}/userphotos/${req.file.filename}` })
                    .then((afterUpdate)=>{ res.json({message : `on a bien fait un mis a jour d'utilisateur n° ${req.params.id}`, data : afterUpdate})})
                }
            })     
        } else {
            req.body.username = afterFindByPk.username
            if(!req.file){
                return afterFindByPk.update(req.body)
                .then((afterUpdate)=>{res.json({message : `on a bien fait un mis a jour d'utilisateur n° ${req.params.id}`, data : afterUpdate})})
            } else {
                return afterFindByPk.update({...req.body, photo: `${req.protocol}://${req.get('host')}/userphotos/${req.file.filename}` })
                .then((afterUpdate)=>{ res.json({message : `on a bien fait un mis a jour d'utilisateur n° ${req.params.id}`, data : afterUpdate})})
            }
        }
    })
    .catch((error)=>{ 
        if(error instanceof ValidationError || error instanceof UniqueConstraintError){
            return res.json({message : error.message})
        }
        res.status(500).json({message : `il y a une erreur`, error : error.message})
    })
}


const deleteUser = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver utilisateur n° ${req.params.id}`})
    }
    User.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.destroy()
        .then(()=>{res.json({message : `on a bien supprime utilisateur n° ${req.params.id}`, data : afterFindByPk})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const findLostUserId = (req, res) => {
    const birthdate = `${req.params.birthdate}T00:00:00.000Z`
    User.findOne({where : {email : req.params.email, firstname : req.params.firstname, birthdate : birthdate}})
    .then((afterfindOne)=>{
        if(afterfindOne){
            res.json({message : `user founded`, data : afterfindOne})
        } else {
            res.status(404).json({message : `* il y a pas d'utilisateur matched`})
        }
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const findLostUserPassword = (req, res, next) => {
    const birthdate = `${req.params.birthdate}T00:00:00.000Z`
    User.scope('withPassword').findOne({where : { username : req.params.username, email : req.params.email, firstname : req.params.firstname, birthdate : birthdate}})
    .then((afterfindOne)=>{
        if(afterfindOne){
            req.body.password = afterfindOne.password
            next()
        } else {
            res.status(404).json({message : `* il y a pas d'utilisateur matched`})
        }
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findAllUsers, findUserByPk, createUser, updateUser, deleteUser, findLostUserId, findLostUserPassword }