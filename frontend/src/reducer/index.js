import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import userSlice from "../slices/userSlice";
import chatSlice from "../slices/chatSlice";

const rootReducer = combineReducers({
    auth:authSlice,
    user:userSlice,
    chat:chatSlice
});

export default rootReducer;