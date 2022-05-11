import express from 'express';
import productsController from '../controllers/productsController.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', productsController.productsAll)
router.get("/:pid",productsController.productId)
router.post('/',upload.single('thumbnail'), productsController.newProduct)
router.put("/:pid",upload.none(),productsController.updateProduct)
router.delete("/:pid",productsController.deleteProduct)


export default router;