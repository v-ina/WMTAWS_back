// project_final_alpha

const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3333
const { sequelize } = require('./db/sequelizeSetup')
const cors = require('cors')
const path = require("path")

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
// app.use(cors("http://"))
// app.use(cors({ origin: 'http://localhost:3333' }))

// app.set("port", process.env.PORT || port)

app.use('/attachments', express.static(path.join(__dirname, 'attachments')));
app.use('/userphotos', express.static(path.join(__dirname, 'userphotos')));


const articleRouter = require('./routes/articleRoutes')
const userRouter = require('./routes/userRoutes')
const commentRouter = require('./routes/commentRoutes')
const likeRouter = require('./routes/likeRoutes')
const reportRouter = require('./routes/reportRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const suggestionRouter = require('./routes/suggestionRoutes')
const messageRouter = require('./routes/messageRoutes')

app.use('/api/articles', articleRouter)
app.use('/api/users', userRouter)
app.use('/api/comments', commentRouter)
app.use('/api/likes', likeRouter)
app.use('/api/reports', reportRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/suggestions', suggestionRouter)
app.use('/api/message', messageRouter)


app.listen(port, ()=>{
    console.log(`app is listening port ${port}`);
})

app.get("/", (req,res)=>{
    res.json('My api running here =)')
})