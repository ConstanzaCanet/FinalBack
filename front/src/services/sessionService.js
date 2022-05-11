import { getAuthHeaders } from "../utils";
export default class SessionService{
    httpClient;
    constructor(client){
        this.httpClient=client;
    }
    login = ({body,callbackSuccess,callbackError}) => {
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_LOGIN}`,config:getAuthHeaders(),body,callbackSuccess,callbackError};
        this.httpClient.makePostRequest(data);
    }
    current = ({callbackSuccess,callbackError})=>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CURRENT}`,config:getAuthHeaders(),callbackSuccess,callbackError};
        this.httpClient.makeGetRequest(data);
    }
    register = ({body,callbackSuccess,callbackError})=>{
        const data = {url:`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_REGISTER}`,config:getAuthHeaders(),body,callbackSuccess,callbackError};
        this.httpClient.makePostRequest(data);
    }
}