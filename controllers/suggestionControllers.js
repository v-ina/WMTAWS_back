const { User, Suggestion } = require('../db/sequelizeSetup')


const findAllSuggestions = (req, res) => {
    Suggestion.findAll({include : User})
    .then((result)=>{ res.json({message : `il y a ${result.length} Suggestions`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const createSuggestion = (req, res) => {
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        return Suggestion.create({...req.body, userId : afterFindOne.id})
        .then((result)=>{res.json({message : `vous avez envoyer une suggestion`, data : result})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message}) })
}


const deleteSuggestion = (req, res) => {
    if(!req.params.id){
        return res.status(404).json({message : `on peut pas trouver suggestion n° ${req.params.id}`})
    }
    Suggestion.findByPk(req.params.id)
    .then((afterFindByPk)=>{
        return afterFindByPk.destroy()
        .then(()=>{res.json({message : `on a bien supprime suggestion n° ${req.params.id}`, data : afterFindByPk})})
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findAllSuggestions, createSuggestion , deleteSuggestion }