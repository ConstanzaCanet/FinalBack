import Dao from "../model/Dao.js";
import UserService from "./usersService.js";
import CartService from "./cartService.js";
import ProductsService from "./productsService.js";
import ChatService from "./chatService.js";
import config from "../config/config.js";

const dao = new Dao(config.mongo);

export const userService = new UserService(dao);
export const cartService = new CartService(dao);
export const productsService = new ProductsService(dao);
export const chatService = new ChatService(dao);