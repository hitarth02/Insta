import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChat:null,
    chats:[],
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
    }
});

export const {setChats , setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer; 