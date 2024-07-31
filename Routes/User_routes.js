const User_controller=require('../Controller/User_controller')
const {authentication}=require('../Middleware/JWT_authentication')
module.exports=app=>{
    app.post('/api/user/create_user',User_controller.create_user)
    app.patch('/api/user/change_status',authentication,User_controller.update_status)
    app.post('/api/user/calculate_distance',authentication,User_controller.calculate_km)
    app.post('/api/users/get_user_listing',authentication,User_controller.calculate_Days)
}