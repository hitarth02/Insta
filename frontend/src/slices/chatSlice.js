import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChat:null,
    chats:[],
    notification:[]
};

const chatSlice = createSlice({
    name:"chat",
    initialState:initialState,
    reducers:{
        setSelectedChat(state , action){
            state.selectedChat = action.payload
        },
        setChats(state , action){
            state.chats = action.payload
        },
        setNotification(state , action){
            state.notification = action.payload
        },
    }
});

export const {setChats , setSelectedChat , setNotification} = chatSlice.actions;
export default chatSlice.reducer; 