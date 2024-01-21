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
    Role.create({"label" : "superadmin", "roleId" : 1})
    Role.create({"label" : "admin", "roleId" : 2})
    Role.create({"label" : "user", "roleId" : 2})
}


module.exports = { setCategories,  setUsers, setRoles }