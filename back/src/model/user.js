import mongoose from "mongoose";

let Schema = mongoose.Schema;
export default class User{
    constructor(data){
        this.data =data;
    }
    static get model(){
        return 'users';
    }
    static get schema(){
        return{
            first_name:String,
            last_name:String,
            password:String,
            role:String,
            email:String,
            status:{
                type:Boolean,
                default:true
            },
            cart:{
                type:Schema.Types.ObjectId,
                ref:"carts"
            },
            phone:String,
            profile_picture:String
        }
    }
}