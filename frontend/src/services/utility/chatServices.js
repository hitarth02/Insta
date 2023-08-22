import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { chatApi } from "../apis/chatApi";
import { setSelectedChat } from "../../slices/chatSlice";


export async function accessChat(data , token){
    let result;
    try {
        const response = await apiConnector("POST" , chatApi.CREATE_CHAT_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function fetchChats(token){
    let result=[];
    try {
        const response = await apiConnector("GET" , chatApi.FETCH_CHATS_API, {} , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function createGroup(data , token){
    let result;
    try {
        const response = await apiConnector("POST" , chatApi.CREATE_GROUP_CHAT_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("Group has been created!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function addUserToGroup(data , token){
    let result;
    try {
        const response = await apiConnector("PUT" , chatApi.ADD_USER_TO_GROUP , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("User Added!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function removeUserFromGroup(data , token){
    let result;
    try {
        const response = await apiConnector("PUT" , chatApi.REMOVE_USER_FROM_GROUP , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("User removed!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function renameGroup(data , token){
    let result;
    try {
        const response = await apiConnector("PUT" , chatApi.RENAME_GROUP_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("Group renamed!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function changeGroupLogo(data , token ){
    let result;
    let groupChat;
    try {
        const response = await apiConnector("PUT" , chatApi.UPDATE_GROUP_LOGO_API , data , {"Content-Type":"multipart/form-data" , Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        groupChat = response.data.updateGroup;
        toast.success("Group profile updated!");
    } catch (error) {
        console.log(error);
    };
    let fullRes = {result,groupChat}
    return fullRes;
};

export async function deleteGroupService(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("DELETE" , chatApi.DELETE_GROUP_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("Group Deleted!");
        dispatch(setSelectedChat(null));
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function sendMessage(data , token){
    let result;
    try {
        const response = await apiConnector("POST" , chatApi.SEND_MESSAGE_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function getAllMessages(data , token){
    let result;
    try {
        const response = await apiConnector("POST" , chatApi.GET_ALL_MESSAGES_API , data , { Authorization: `Bearer ${token}`} );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
    } catch (error) {
        console.log(error);
    };
    return result;
};