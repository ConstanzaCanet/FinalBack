import mongoose from "mongoose"


let Schema = mongoose.Schema;
export default class Carts {
    constructor(data){
        this.data = data;
    }
    static get model(){
        return 'carts';
    }
    static get schema(){
        return {
            products:[
                {
                    product:{
                        type:Schema.Types.ObjectId,
                        ref:"products"
                    },
                    quantity:{
                        type:Number,
                        default:1
                    }
                }
            ]
            
        }
    }
}

