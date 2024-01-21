const users = require('./mock-users')
const bcrypt = require('bcrypt')


const setCategories = (Category) => {
    Category.create({"id" : 1, "category" : "dev"})
    Category.create({"id" : 2, "category" : "student"})
    Category.create({"id" : 3, "category" : "sport"})
    Category.create({"id" : 4, "category" : "game"})
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
    Role.create({"id" : 1, "label" : "superadmin"})
    Role.create({"id" : 2, "label" : "admin"})
    Role.create({"id" : 3, "label" : "user"})
}


module.exports = { setCategories,  setUsers, setRoles }