const mongoose=require('mongoose')

const Connection=mongoose.connect('mongodb://127.0.0.1:27017/NodeApp').then(()=>{
    console.log('Connection succesful')
})
.catch((err)=>{
    console.log(err)
})

module.exports=Connection