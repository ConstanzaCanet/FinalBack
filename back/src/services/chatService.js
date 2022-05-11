import GenericQueries from "./genericQueries.js";
import Chat from "../model/chat.js";

export default class ChatService extends GenericQueries{
    constructor(dao){
        super(dao,Chat.model)
    }

    getAllAndPopulate = async(params) =>{
        let result = await this.dao.models[Chat.model].find(params).populate('author');
        return result;
    }
}