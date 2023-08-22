import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    signupToken: null,
};

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData(state , action){
            state.signupData = action.payload
        },
        setSignupToken(state , action){
            state.signupToken = action.payload
        },
    }
});

export const {setSignupData , setSignupToken} = authSlice.actions;
export default authSlice.reducer; 