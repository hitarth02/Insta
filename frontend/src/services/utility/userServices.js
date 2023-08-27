import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { userApi } from "../apis/userApi";
import { setUser } from "../../slices/userSlice";

export async function getAllusers(){
    let result = [];
    const toastId = toast.loading("Updating...")
    try {
        const response = await apiConnector("GET" , userApi.GET_ALL_USERS_API );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
    } catch (error) {
        console.log(error);
    };
    toast.dismiss(toastId);
    return result;
};

export async function getUserDetails(data){
    let result;
    try {
        const response = await apiConnector("POST" , userApi.GET_USER_DETAILS_API , data );
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

export async function updateUserDetails(data , token , dispatch){
    let result;
    const toastId = toast.loading("Updating...")
    try {
        const response = await apiConnector("PUT" , userApi.UPDATE_USER_DETAILS_API , data , {Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        console.log("API RESPONSE",result);
        localStorage.setItem("user",JSON.stringify(response.data.data));
        dispatch(setUser(result));
    } catch (error) {
        console.log(error);
    };
    toast.dismiss(toastId);
    return result;
};

export async function updateUserPicture(data , token , dispatch){
    let result;
    const toastId = toast.loading("Updating...")
    try {
        const response = await apiConnector("PUT" , userApi.UPDATE_USER_PICTURE_API , data , {"Content-Type":"multipart/form-data" , Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        localStorage.setItem("user",JSON.stringify(response.data.data));
        dispatch(setUser(result));
        toast.success("Profile picture updated!");
    } catch (error) {
        console.log(error);
    };
    toast.dismiss(toastId);
    return result;
};

export async function followUser(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("POST" , userApi.FOLLOW_USER_API , data , { Authorization: `Bearer ${token}`});
        console.log("API RES>>>>",response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.currentUser;
        localStorage.setItem("user",JSON.stringify(response.data.currentUser));
        dispatch(setUser(result));
    } catch (error) {
        console.log(error);
    };
    return result;
};


export async function unFollowUser(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("POST" , userApi.UNFOLLOW_USER_API , data , { Authorization: `Bearer ${token}`});
        console.log("API RES>>>>",response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.currentUser;
        localStorage.setItem("user",JSON.stringify(response.data.currentUser));
        dispatch(setUser(result));
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function searchUser(data , token){
    let result=[];
    try {
        const response = await apiConnector("GET" , userApi.SEARCH_USER_API + `?search=${data}` , data , { Authorization: `Bearer ${token}`});
        console.log("API RES>>>>",response);
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

export async function notificationApi(token){
    let result=[];
    try {
        const response = await apiConnector("GET" , userApi.NOTIFICATIONS_API , {} , { Authorization: `Bearer ${token}`});
        console.log("API RES>>>>",response);
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