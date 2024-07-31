const express=require('express')
const app=express()
const  bodyParser = require('body-parser')
require('dotenv').config()
require('./Connection/Connection')
const cors=require('cors')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
const PORT=process.env.PORT
app.get('/',(req,res)=>{
    res.send({message:'Welcome to Application'})
})
require('./Routes/User_routes')(app)
app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`)
})