import Products from "../model/products.js";
import GenericQueries from "./genericQueries.js";


export default class ProductsService extends GenericQueries{
    constructor(dao){
        super(dao,Products.model);
    }
}