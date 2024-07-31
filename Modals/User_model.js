const mongoose=require('mongoose')

const user_model=mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId
    },
    Name:{
        type:String
    },
    Email:{
        type:String
    },
    Password:{
        type:String
    },
    Address:{
        type:String
    },
    Lattitude:{
        type:String
    },
    Longitude:{
        type:String
    },
    registered_at:{
        type:String,
    },
    status:{
        type:String,
        default:"ACTIVE"
    }
})

const user_Schema=mongoose.model("Users",user_model)
module.exports=user_Schema;