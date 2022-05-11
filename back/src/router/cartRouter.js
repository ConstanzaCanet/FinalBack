import express from "express";
import upload from "../utils/upload.js"
import cartController from '../controllers/cartController.js'

const router =express.Router();


router.post('/purchase/:cid',upload.none(),cartController.confirmPurchase);
//Veo informacion de carrito existente
router.get('/:cid',cartController.showCart)
//Agrego producto a carrito existente
router.post('/:cid/products/:pid',upload.none(),cartController.addToCart)
//Actualizo carrito
router.put('/:cid/',upload.none(),cartController.updateCart);
//Elimino producto del carrito
router.delete('/:cid/products/:pid',cartController.deleteCart)




export default router;