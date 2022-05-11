import mongoose from "mongoose";


export default class Products{
    constructor(data){
        this.data =data;
    }
    static get model(){
        return 'products';
    }
    static get schema(){
        return{
            title:String,
            description:String,
            price:Number,
            stock:Number,
            code:String,
            thumbnail:String,
            status:{
                type:String,
                default:"available"
            }
        }
    }
}