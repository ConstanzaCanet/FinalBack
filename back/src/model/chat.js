import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Chat{
    constructor(data){
        this.data =data;
    }
    static get model(){
        return 'chats'
    }
    static get schema(){
        return{
            author:{
                type:Schema.Types.ObjectId,
                ref:"users"
            },
            content:String
        }
    }

} 
