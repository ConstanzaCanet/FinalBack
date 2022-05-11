import { userService } from "../services/services.js";

const user= async (req,res)=>{
    try {        
        let results = await userService.getAll();
        res.send(results)
    } catch (error) { }
};

const userId = async (req,res)=>{
    let uid = req.params.uid
    try {
        let result = await userService.getBy({_id:uid});
        res.send(result)
    } catch (error) { }
};

export default{
    user,userId
}