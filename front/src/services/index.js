import axiosHTTPClient from './axiosHTTPClient.js';
import ProductsService from './productsService.js';
import SessionService from './sessionService.js';
import CartsService from './cartsService.js';
const client = new axiosHTTPClient();
export const productsService = new ProductsService(client);
export const sessionService = new SessionService(client);
export const cartService = new CartsService(client);