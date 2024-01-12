const { Category } = require('../db/sequelizeSetup')


const findCategoryByLabel = (req, res) => {
    Category.findAll({where : {category : req.params.id}})
    .then((result)=>{ res.json({message : `il y a ${result.length} articles`, data : result}) })
    .catch((error)=>{ res.status(500).json({message : `il y a une erreur`, error : error.message})})
}


module.exports = { findCategoryByLabel }