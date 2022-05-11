import {getAuthHeaders} from '../utils.js'

export default class ProductsService{
    httpClient
    constructor(client){
        this.httpClient=client;
    }

    getProducts = (callbackSuccess,callbackError) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_GET_ALL_PRODUCTS}`,config:getAuthHeaders(),callbackSuccess,callbackError}
        this.httpClient.makeGetRequest(data);
    }
    getProductById = ({pid,callbackSuccess,callbackError}) =>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_GET_PRODUCT_BY_ID}${pid}`,config:getAuthHeaders(),callbackSuccess,callbackError} 
        this.httpClient.makeGetRequest(data);   
    }
    createProduct=({body,callbackSuccess,callbackError})=> {
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CREATE_PRODUCT}`,body,config:getAuthHeaders(),callbackSuccess,callbackError}
        this.httpClient.makePostRequest(data);
    }
    updateProduct=({pid,body,callbackSuccess,callbackError})=>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_UPDATE_PRODUCT}${pid}`,body,config:getAuthHeaders(),callbackSuccess,callbackError};
        this.httpClient.makePutRequest(data);
    }
    deleteProduct=({pid,callbackSuccess,callbackError})=>{
        const data ={url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_DELETE_PRODUCT}${pid}`,config:getAuthHeaders(),callbackSuccess,callbackError};
        this.httpClient.makeDeleteRequest(data);
    }
}