import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { postApi } from "../apis/postApi";
import { setUser } from "../../slices/userSlice";

export async function getAllPosts(){
    let result=[];
    try {
        const response = await apiConnector("GET" , postApi.GET_ALL_POSTS_API );
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

export async function getSinglePost(data , token){
    let result;
    try {
        const response = await apiConnector("POST" , postApi.GET_SINGLE_POST_API , data , { Authorization: `Bearer ${token}`} );
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

export async function createPost(data , token , dispatch , navigate){
    let result;
    const toastId = toast.loading("Uploaing...");
    try {
        const response = await apiConnector("POST" , postApi.CREATE_POST_API , data , {"Content-Type":"multipart/form-data" , Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.user;
        localStorage.setItem("user",JSON.stringify(response.data.user));
        dispatch(setUser(result));
        navigate(`/profile/${response.data.user.email}`);
        toast.success("Posted successfully!");
    } catch (error) {
        console.log(error);
    };
    toast.dismiss(toastId);
    return result;
};

export async function addLike(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("POST" , postApi.LIKE_POST_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.like;
        dispatch(setUser(response.data.data));
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function removeLike(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("POST" , postApi.UNLIKE_POST_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.unLike;
        dispatch(setUser(response.data.data));
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function savePost(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("PUT" , postApi.SAVE_POST_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.post;
        dispatch(setUser(response.data.data));
        toast.success("Saved to collection!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function unSavePost(data , token , dispatch){
    let result;
    try {
        const response = await apiConnector("PUT" , postApi.UN_SAVE_POST_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.post;
        dispatch(setUser(response.data.data));
        toast.success("Removed from collection!");
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function addComment(data , token , ){
    let result;
    try {
        const response = await apiConnector("POST" , postApi.ADD_COMMENT_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.post;
        toast.success("Comment added!")
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function removeComment(data , token){
    let result;
    try {
        const response = await apiConnector("DELETE" , postApi.DELETE_COMMENT_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.post;
        toast.success("Comment Deleted!")
    } catch (error) {
        console.log(error);
    };
    return result;
};

export async function deletePost(data , token ){
    let result;
    try {
        const response = await apiConnector("DELETE" , postApi.DELETE_POST_API , data , { Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        toast.success("Post Deleted!")
    } catch (error) {
        console.log(error);
    };
    return result;
};



//REELS

export async function createReel(data , token , dispatch , navigate){
    let result;
    const toastId = toast.loading("Uploaing...");
    try {
        const response = await apiConnector("POST" , postApi.CREATE_REEL_API , data , {"Content-Type":"multipart/form-data" , Authorization: `Bearer ${token}`});
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.user;
        localStorage.setItem("user",JSON.stringify(response.data.user));
        dispatch(setUser(result));
        navigate(`/profile/${response.data.user.email}`);
        toast.success("Posted successfully!");
    } catch (error) {
        console.log(error);
    };
    toast.dismiss(toastId);
    return result;
};

export async function getAllReels(){
    let result=[];
    try {
        const response = await apiConnector("GET" , postApi.GET_ALL_REELS_API );
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