const { Article, Category,  Comment, Like, User } = require('../db/sequelizeSetup')


const fidnAllLikesByUser = (req,res) =>{
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        return Like.findAll({ where: { userId: afterFindOne.id }, include: [{ model: Article, include: [{ model: User },{ model: Comment },{ model: Category }]}]})
        .then((result)=>{ res.json({message : `il y a ${result.length} Comments`, data : result}) })
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})   
}


const toggleLike = (req, res) => {
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        return Like.findOne({ where: { articleId : req.params.id, userId : afterFindOne.id } })
        .then((result)=>{
            let like = result
            if(like){
                return Like.destroy({ where: { articleId : req.params.id, userId : afterFindOne.id } })
                .then(()=>{
                    res.status(200).json({ message: `j'ai annule "j'aime Content id n° ${req.params.id}`})
                })
            } else {
                return Like.create({articleId : req.params.id, userId : afterFindOne.id})
                .then((afterCreate)=>{
                    like = afterCreate
                    res.status(200).json({ message: ` j'ajoute "j'aime" Content id n° ${req.params.id}`});
                })
            }
        })
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})}) 
}  


module.exports = { fidnAllLikesByUser, toggleLike}