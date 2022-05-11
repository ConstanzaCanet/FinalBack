import mongoose from "mongoose";
import User from "./user.js";
import Carts from "./carts.js";
import Products from "./products.js";
import Chat from "./chat.js";


export default class Dao{
    constructor(config){
        this.mongoose = mongoose.connect(config.url,{useNewUrlParser:true}).catch(error=>{
            process.exit();
        })
        const timestamp = {timestamps:{createdAt:'created_at',updatedAt:'updated_at'}};
        const userSchema = mongoose.Schema(User.schema,timestamp);
        const cartsSchema = mongoose.Schema(Carts.schema,timestamp);
        const productsSchema = mongoose.Schema(Products.schema,timestamp);
        const chatsSchema = mongoose.Schema(Chat.schema,timestamp);

        this.models={
            [User.model]:mongoose.model(User.model,userSchema),
            [Carts.model]:mongoose.model(Carts.model,cartsSchema),
            [Products.model]:mongoose.model(Products.model,productsSchema),
            [Chat.model]:mongoose.model(Chat.model,chatsSchema)
        }
    }

    findOne = async(options,entity)=>{
        if(!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`)
        let result  = await this.models[entity].findOne(options);
        return result?result.toObject():null;
    }

    getAll = async(options,entity)=>{
        if(!this.models[entity]) throw new Error(`Entity ${entity} not in dao`)
        let results = await this.models[entity].find(options);
        return results.map(res=> res.toObject())
    };

    insert = async(document,entity)=>{
        if(!this.models[entity]) throw new Error(`Esquema ${entity} no encontrado`)
        try {
            let instance = new this.models[entity](document);
            let result=await instance.save();
            return result?result.toObject():null;
        } catch (error) {
            return null;
        }
    };

    update = async(document,entity)=>{
        if(!this.models[entity]) throw new Error(`Esquema ${entity} no encontrado`)
        let id = document._id;
        delete document._id;
        let result = await this.models[entity].findByIdAndUpdate(id,{$set:document},{new:true})
        return result.toObject();
    }

    
    delete = async(id,entity)=>{
        if(!this.models[entity]) throw new Error(`Esquema ${entity} no encontrado`)
        let result = await this.models[entity].findByIdAndDelete(id);
        return result?result.toObject():null;
    }

    exists = async(entity,options)=>{
        if(!this.models[entity]) throw new Error(`Esquema ${entity} no encontrado`)
        return this.models[entity].exists(options)
    }

}