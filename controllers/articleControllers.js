const { Article, Category,  Comment, Like, User } = require('../db/sequelizeSetup')
const { Op, ValidationError, UniqueConstraintError } = require('sequelize')


const findAllArticles = (req, res) => {
    const query = req.query.search
    if(query){

        return Article.findAll({ where: { title: { [Op.like]: `%${query}%` } }, include: [{ model: Comment, include: [User] }, Like, User, Category]})
        .then((result)=>{ res.json({message : `il y a ${result.length} articles avec le mot cle ${query}`, data : result}) })
        .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
    }
    Article.findAll({include : [{model : Comment, include : User},Like,User,Category]})
    .then((result)=>{ res.json({message : `il y a ${result.length} articles`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error})})
}


const findArticleByPk = (req, res) => {
    Article.findByPk(req.params.id, {include : [{model : Comment, include : User},Like,User,Category]})
    .then((result)=>{
        if(!result){
            return res.status(404).json({message : `on peut pas trouver article n° ${req.params.id}`})
        }
        res.json({message : `c'est l'article id n° ${req.params.id}`, data : result})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const createArticle =(req,res)=>{
    User.findOne({where : {username : req.username}})
    .then(foundUser =>{
        if(!foundUser){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        const userIdWhoCreate = foundUser.id
        if(req.files){
            const fileInfos = req.files
            const uploadedFiles = []
            fileInfos.forEach((file, index)=>{
                let filename = `${req.protocol}://${req.get('host')}/attachments/${file.filename}`
                uploadedFiles.push(filename)
            })
            return Article.create({...req.body, userId : userIdWhoCreate, attachment : uploadedFiles }) 
            .then((result)=>{
                res.json({message : "l'article a bien ete ajoute" , data : result})
            })
        } else {
            return Article.create({...req.body, userId : userIdWhoCreate, attachment: null}) 
            .then((result)=>{
                res.json({message : 'le coworking a bien ete ajoute' , data : result})
            })
        }
    })
    .catch((error)=> {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: 'Une erreur est survenue.', data: error.message })
        }
        res.status(500).json({message : 'une erreur est survenue', data : error.message}) 
    })
}


const updateArticle = (req,res) =>{
    Article.findByPk(req.params.id)
    .then((result) => {
        if (result) {
            if(!req.files){
                return result.update(req.body)
                .then(() => {
                    res.json({ message: `l'article a bien été mis à jour.`, data: result })
                })
            } else {
                result.attachments = []
                const fileInfos = req.files
                const updatedFiles = []
                fileInfos.forEach(file=>{
                    let filename = `${req.protocol}://${req.get('host')}/attachment/${file.filename}`
                    updatedFiles.push(filename)
                })
                return result.update({...req.body, attachment : updatedFiles})
                .then(() => {
                    res.json({ message: `L'article a bien été mis à jour.`, data: result })
                })
            }
        } else {
            res.status(404).json({ message: `Aucun coworking à mettre à jour n'a été mis à jour.` })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: 'Une erreur est survenue.', data: error.message })
        }
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}


const deleteArticle = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver article n° ${req.params.id}`})
    }
    Article.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.destroy()
        .then(()=>{res.json({message : `on a bien supprime article n° ${req.params.id}`, data : afterFindByPk})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findAllArticles, findArticleByPk, createArticle, updateArticle, deleteArticle }