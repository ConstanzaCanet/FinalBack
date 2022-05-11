import { cartService,userService,productsService } from "../services/services.js";

//Muestro el carrito por id
const showCart = async (req,res)=>{
    try {
        let id = req.params.cid;
        let cart = await cartService.getByWithPopulate({_id:id})
        res.send({status:"success",payload:cart})
    } catch (error) { }
}


//Agrego producto al carrito
const addToCart = async (req,res)=>{
        let quantityChanged = false;
        let {cid,pid} = req.params;
        let {quantity} = req.body;//3
        //Check if product exists
        let product = await productsService.getBy({_id:pid});
        if(!product) return res.status(404).send({status:"error",error:"No se encuentra ese producto"});
        //check if cart exists
        let cart = await cartService.getBy({_id:cid});
        if(!cart) return res.status(404).send({status:"error",error:"No se encontro el carrito"});
        //Check product stock
        if(product.stock===0) return res.status(400).send({status:"error",error:"Lo sentimos, se ha vendido todo lo que teniamos!"});
        //Check if requested quantity is greater than product stock
        if(product.stock<quantity){
            quantity=product.stock
            quantityChanged=true;
        }
        //Remove stock
        product.stock = product.stock - quantity;
        if(product.stock===0)
            product.status="unavailable"
        await productsService.update(pid,product);
        //Add product to cart
        cart.products.push({product:pid,quantity});
        await cartService.update(cid,cart);
        res.send({status:"success",quantityChanged,newQuantity:quantity,message:"Se agrego el producto al carrito!"})
}
//Elimino producto del carrito---> recordar que por defecto siempre existe
const deleteCart = async (req,res)=>{
    let {pid,cid} = req.params;
    //Check if cart exists.
    let cart = await cartService.getByWithPopulate({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"Can't find cart"});
    //Check if product exists in the cart
    if(cart.products.some(element=>element.product._id.toString()===pid)){
        //Get product with pid
        let product = await productsService.getBy({_id:pid});
        if(!product) return res.status(404).send({status:"error",error:"Product not found"});
        //Get associated product on Cart
        let productInCart = cart.products.find(element=>element.product._id.toString()===pid);
        //Restock actual quantity
        product.stock = product.stock + productInCart.quantity;
        await productsService.update(pid,product);
        //Delete product from cart
        cart.products = cart.products.filter(element=>element.product._id.toString()!==pid);
        await cartService.update(cid,cart);
        res.send({status:"success",message:"Product deleted"})
    }else{
        res.status(400).send({error:"Product not found in the cart"})
    }

}
//Actualizacion del carro
const updateCart = async(req,res)=>{
    let {cid} = req.params;
    let {products} = req.body;
    let stockLimitation = false;

    let cart = await cartService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"No encuentro el carrito"});

    for(const element of cart.products){
        let product = await productsService.getBy({_id:element.product});

        let associatedProductInCart = cart.products.find(element=>element.product.toString()===product._id.toString());

        let associatedProductInInput = products.find(element=>element.product.toString()===product._id.toString());
        if(associatedProductInCart.quantity!==associatedProductInInput.quantity){

            if(associatedProductInCart.quantity>associatedProductInInput.quantity){
                let difference = associatedProductInCart.quantity - associatedProductInInput.quantity;
                associatedProductInCart.quantity = associatedProductInInput.quantity;
                product.stock+=difference;

                await productsService.update(product._id,product);
            }else{
                let difference = associatedProductInInput.quantity - associatedProductInCart.quantity;
                if(product.stock>=difference){
                    product.stock -=difference;
                    await productsService.update(product._id,product);
                    associatedProductInCart.quantity = associatedProductInInput.quantity;
                }
                else{
                    stockLimitation=true;
                    associatedProductInCart.quantity +=product.stock;
                    product.stock=0;
                    await productsService.update(product._id,product);
                }
            }
        }
    }
    await cartService.update(cid,cart);
    res.send({status:"success",stockLimitation})
}
const confirmPurchase = async(req,res) =>{
    let {cid} = req.params;
    let cart = await cartService.getBy({_id:cid});
    if(!cart)  return res.status(404).send({status:"error",error:"No encuentro el carrito"});
    cart.products=[];
    await cartService.update(cid,cart);
    res.send({status:"success",message:"Finished purchase!"})
}

export default{
    showCart,addToCart,deleteCart, updateCart,confirmPurchase
}