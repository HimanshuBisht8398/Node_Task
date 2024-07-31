const user_Schema=require('../Modals/User_model')
const bcrypt=require('bcryptjs')
const moment=require('moment')
const {Jwt_sign}=require('../Middleware/JWT_authentication')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const secrate_key=process.env.Secret_key
exports.create_user=async(req,res)=>{
    try{
        const{name,email,password,address,lattitude,longitude}=req.body
        const verify_email=await user_Schema.findOne({Email:email})
        if(verify_email){
            return res.status(401).send({code:401,message:"Email Already Exsist"})
        }
        else{

            let hashpassword=await bcrypt.hash(password,10)

            const token_creation=await Jwt_sign(name,email,password,address,lattitude,longitude)
            let create_user=new user_Schema({
                Name:name,
                Email:email,
                Password:hashpassword,
                Address:address,
                Lattitude:lattitude,
                Longitude:longitude,
                registered_at:moment().format(),
                token:token_creation
            })
            await create_user.save()
            create_user = create_user.toObject();
            delete create_user.Password
            return  res.status(201).send({code:201,message:"User Created",data:{...create_user,token:token_creation},})
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).send({code:500,message:"Internal Server Error"})
    }
}

exports.update_status=async(req,res)=>{
    try{
        const status=req.body.status
        if(status=='ACTIVE'){
            let find_all_users=await user_Schema.find({status:status})
            if(find_all_users.length==0){
                return res.status(404).send({code:404,message:"No Such user Found with ACTIVE status"})
            }
            else{
                const update_status=await user_Schema.updateMany({status:status},{status:"INACTIVE"})
                return res.status(200).send({code:200,messgae:"status updated "})
            }
        }
        else if(status=='INACTIVE'){
            let find_all_users=await user_Schema.find({status:status})
            if(find_all_users.length==0){
                return res.status(404).send({code:404,message:"No Such user Found with INACTIVE status"})
            }
            else{
                const update_status=await user_Schema.updateMany({status:status},{status:"ACTIVE"})
                return res.status(200).send({code:200,messgae:"status updated "})
            }
            
        }
        else{
            return res.status(400).send({code:400,message:"Please Enter Valid Status ACTIVE OR INACTIVE"})
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).send({code:500,message:"Server Error"})
    }
}

exports.calculate_Days = async (req, res) => {
    try {
        const mapping_obj = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        };

        const { week_Days } = req.body;

        // Validate weekdays
        const outOfRange = week_Days?.filter(day => day > 6 || day < 0) || [];
        if (outOfRange.length) {
            return res.json({
                status: 400,
                message: "Invalid week days",
                data: null
            });
        }

        // Fetch data from the database
        let find_Data = await user_Schema.find({ status: "ACTIVE" })
            .select({ registered_at: 1, Name: 1, Email: 1, _id: 0 });

        // Prepare a result object to hold the filtered data
        const result = {};

        // Process each day and filter data
        for (const day of week_Days) {
            const dayStr = mapping_obj[day];
            // Filter data based on day of the week
            const filteredData = find_Data.filter(user => 
                moment(user.registered_at).format('dddd') === dayStr
            );

            // Assign filtered data to the result object
            result[dayStr] = filteredData;
        }

        return res.json({
            status: 200,
            data: result,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: null
        });
    }
};

exports.calculate_km = async (req, res) => {
    try {
        const { Destination_latitude, Destination_longitude } = req.body;
        if (Destination_latitude && Destination_longitude) {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({ code: 401, message: "Authorization token missing" });
            }

            const decode = jwt.verify(token, secrate_key);
            const current_latitude = decode.Lattitude;
            const current_longitude = decode.Longitude;

            const distance = calculateDistance(
                parseFloat(current_latitude),
                parseFloat(current_longitude),
                parseFloat(Destination_latitude),
                parseFloat(Destination_longitude)
            );

            return res.status(200).send({ code: 200, message: "Distance calculated successfully", distance: `${distance.toFixed(2)} km` });
        } else {
            return res.status(400).send({ code: 400, message: "Destination latitude and longitude required" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
};

