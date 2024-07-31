const jwt=require('jsonwebtoken')
require('dotenv').config()
const secrate_key=process.env.Secret_key;

const Jwt_sign=async(...payload)=>{
    let payloads={
        Name:payload[0],
        Email:payload[1],
        Password:payload[2],
        Address:payload[3],
        Lattitude:payload[4],
        Longitude:payload[5]
    }
    const options={
        expiresIn:'6h'
    }
    const token=jwt.sign(payloads,secrate_key,options)
    return token;
}


const authentication=async(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        return res.status(401).send({code:401,message:"No Token Present"})
    }
    jwt.verify(token,secrate_key,(err,user)=>{
        if(err){
            return res.status(401).send({code:401,message:"Invaild Token"})
        }
        req.user=user
        next()
    })

}

module.exports={Jwt_sign,authentication}