import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { auth } from "../apis/authApi";
import { setToken, setUser } from "../../slices/userSlice";

export async function signupToken(data , navigate){
    let result;

    try {
        const response = await apiConnector("POST" , auth.SIGNUP_VERIFY_TOKEN , data );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        navigate("/verify-email");
        toast.success("Mail sent!");
    } catch (error) {
        console.log(error);
        toast.error("Error while SiginUp");
    };

    return result;
};

export async function signup(data , navigate){
    let result;
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST" , auth.SIGNUP_API , data );
        console.log(response);
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        result = response.data.data;
        navigate("/login");
        toast.success("Account created!");
    } catch (error) {
        console.log(error);
        toast.error("Error while Login");
    };
    toast.dismiss(toastId);
    return result;
};

export async function login(data , navigate , dispatch){
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST" , auth.LOGIN_API , data );
        if(!response.data.success){
            toast.error(response.data.message);
            throw new Error (response.data.message);
        };
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.data));
        localStorage.setItem("user",JSON.stringify(response.data.user));
        localStorage.setItem("token",JSON.stringify(response.data.data));
        navigate("/");
        toast.success("Logged In!");
    } catch (error) {
        console.log(error);
        toast.error("Error while Login");
    };
    toast.dismiss(toastId);
};

