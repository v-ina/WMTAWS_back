const users = require('./mock-users')
const bcrypt = require('bcrypt')


const setCategories = (Category) => {
    Category.create({"category" : "dev"})
    Category.create({"category" : "sport"})
    Category.create({"category" : "student"})
    Category.create({"category" : "game"})
}


const setUsers = (User) => {
    users.forEach(user =>{
        bcrypt.hash(user.password, 10)
        .then((hashResult)=>{
            User.create({...user, password : hashResult})
            .then(()=>{})
            .catch(error =>{console.log(error.message)})      
        })
        .catch((error)=>{ res.json({message : `il y a une erruer a hasher`, error : error.message})})
    })    
}


const setRoles = (Role) => {
    Role.create({"label" : "superadmin"})
    Role.create({"label" : "admin"})
    Role.create({"label" : "user"})
}


module.exports = { setCategories,  setUsers, setRoles }