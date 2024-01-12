const { User, Role } = require('../db/sequelizeSetup')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const bcrypt = require('bcrypt')
const SECRET_KEY = require('../configs/tokenData')
const jwt = require('jsonwebtoken')
const rolesHierarchy = {
    user: ["user"],
    admin: ["admin", "user"],
    superadmin: ["superadmin", "admin", "user"],
}


const login = (req, res) =>{
    User.scope('withPassword').findOne({where : {username : req.body.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.json({message : `on peut pas trouver nom d'utilisateur ${req.body.username}`})
        }
        bcrypt.compare(req.body.password, afterFindOne.password)
        .then((isValid)=>{
            if(!isValid){
                return res.json({message : `mot de passe n'est pas correct`})
            }
            const token = jwt.sign( {data : {username : afterFindOne.username, userId : afterFindOne.id, role : afterFindOne.roleId}}, SECRET_KEY, {expiresIn : '24h'} )
            res.json({message : `login reussi. bonjour ${afterFindOne.username}`, token : token })
        })
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const protect = (req, res, next) =>{
    if(!req.headers.authorization){
        return res.json({message : `il faut avoir l'accès pour cette service`})
    }
    const token = req.headers.authorization.split(' ')[1]
    if(token){
        try{
            const decoded = jwt.verify(token, SECRET_KEY)
            req.username = decoded.data.username
            next()
        } catch {
            return res.json({message : `token n'est pas valid`})
        }
    }
}


const restrict = (roleParam) => {
    return (req, res, next) => {
        User.findOne({ where: { username: req.username } })
        .then(user => {
            return Role.findByPk(user.roleId)
            .then(role => {
                if (rolesHierarchy[role.label].includes(roleParam)) {
                    next()
                } else {
                    res.status(403).json({ message: `seulement administarateur a l'acces pour cette service`})
                }
            })
        })
        .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
    }
}


const restrictOwnAuthor = (Model) =>{
    return (req, res, next) => {
        Model.findByPk(req.params.id) 
        .then((afterFindByPk)=>{
            if(!afterFindByPk){
                return res.json({message : `on peut pas trouver l'article n° ${req.params.id}`})
            }
            return User.findOne({where : {username : req.username}})
            .then((afterFindOne)=>{
                if (!afterFindOne) {
                    return res.status(404).json({ message: `Pas d'utilisateur trouvé.` })
                }
                return Role.findByPk(afterFindOne.roleId)
                .then((role)=>{
                    if (rolesHierarchy[role.label].includes('admin') || afterFindOne.id === afterFindByPk.userId ) {
                        return next()
                    }else {
                        return res.json({message : `seulement author et administarateur a l'acces pout cette etape`})
                    }
                })
            })
        })
        .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
    }
}


const checkUser = (req,res,next) =>{
    User.findOne({where : {username : req.username}})
    .then((afterFindOne)=>{
        return Role.findByPk(afterFindOne.roleId)
        .then((role)=>{
            if(afterFindOne.id === parseInt(req.params.id) || rolesHierarchy[role.dataValues.label].includes('superadmin')){
                req.body.username = afterFindOne.username
                next()
            } else {
                res.status(403).json({ message : `seulement propriétaire a l'acces pout modifier/supprimer son compte`})
            }
        })
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


const loginWithoutHashing = (req, res) => {
    User.scope('withPassword').findOne({where : {username : req.body.username}})
    .then((afterFindOne)=>{
        if(!afterFindOne){
            return res.json({message : `on peut pas trouver nom d'utilisateur ${req.body.username}`})
        }
        if(req.body.password === afterFindOne.password){
            const token = jwt.sign( {data : {username : afterFindOne.username, userId : afterFindOne.id, role : afterFindOne.roleId}}, SECRET_KEY, {expiresIn : '24h'} )
            return res.json({message : `login reussi. bonjour ${afterFindOne.username}`, token : token })
        } else {
            console.log('에라 모르겠다');
        }
    })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { login, protect, restrict, restrictOwnAuthor, checkUser, loginWithoutHashing }