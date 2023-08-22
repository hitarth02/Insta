const BASE_URL = process.env.REACT_APP_BASE_URL;

export const chatApi = {
    CREATE_CHAT_API: BASE_URL + '/chat/accessChat',
    FETCH_CHATS_API: BASE_URL + '/chat/fetchChats',
    CREATE_GROUP_CHAT_API: BASE_URL + '/chat/createGroupChat',
    ADD_USER_TO_GROUP: BASE_URL + '/chat/addToGroup',
    REMOVE_USER_FROM_GROUP: BASE_URL + '/chat/removeFromGroup',
    RENAME_GROUP_API: BASE_URL + '/chat/renameGroup',
    UPDATE_GROUP_LOGO_API: BASE_URL + '/chat/updateGroupPicture',
    DELETE_GROUP_API: BASE_URL + '/chat/deleteGroup',

    //*SEND MESSAGES
    SEND_MESSAGE_API: BASE_URL + '/chat/sendMessage',
    GET_ALL_MESSAGES_API: BASE_URL + '/chat/allMessages'
};