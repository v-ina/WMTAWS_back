const { Article, Category,  Comment, User, Report } = require('../db/sequelizeSetup')

const findAllReports = (req, res) =>{
    Report.findAll({include: [{ model: Comment, include: [{ model: Article, include: [Category]}, {model : User}]}, { model : Article, include : [Category, User]}, User]})
    .then((result)=>{ res.json({message : `il y a ${result.length} reports`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const createReportOfArticle = (req, res) =>{
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        return Report.create({...req.body, userId : afterFindOne.id, articleId : req.params.articleid})
        .then((result)=>{res.json({message : `on a signale cette comment/article`, data : result})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message}) })
}


const createReportOfComment = (req, res) =>{
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        return Report.create({...req.body, userId : afterFindOne.id, commentId : req.params.commentid})
        .then((result)=>{res.json({message : `on a signale cette comment/article`, data : result})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message}) })
}


const deleteReport = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver report n° ${req.params.id}`})
    }
    Report.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.destroy()
        .then(()=>{res.json({message : `on a bien supprime reportId n° ${req.params.id}`, data : afterFindByPk})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findAllReports, createReportOfArticle, createReportOfComment ,deleteReport }