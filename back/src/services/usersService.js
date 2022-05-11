import User from "../model/user.js";
import GenericQueries from "./genericQueries.js";


export default class UsersService extends GenericQueries{
    constructor(dao){
        super(dao,User.model);
    }
}