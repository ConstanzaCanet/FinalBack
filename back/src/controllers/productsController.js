import {productsService} from '../services/services.js';

const productsAll= async (req,res)=>{
    try {
        let result = await productsService.getAll()
        res.send({status:"success",payload:result})
    } catch (error) { }
};

const productId= async (req,res)=>{
    let id = req.params.pid
    try {
        let result = await productsService.getBy({_id:id})
        res.send({status:"success",payload:result})
    } catch (error) { }
}

const newProduct = async (req,res)=>{
    let newProduct = req.body;
    let file = req.file;
    newProduct.thumbnail = req.protocol+"://"+req.hostname+":8080"+"/img/"+file.filename
    try {
        let result = await productsService.save(newProduct)
        res.send(result)
    } catch (error) { }
}

const updateProduct = async (req,res)=>{
    let updateProduct = req.body;
    let id = req.params.pid
    try {
        let result = await productsService.update(id,updateProduct)
        res.send(result)
    } catch (error) { }
}

const deleteProduct = async (req,res)=>{
    let id = req.params.pid
    try {
        await productsService.delete({_id:id})
    } catch (error) { }
}


export default{
    productsAll, productId, newProduct, updateProduct, deleteProduct
}