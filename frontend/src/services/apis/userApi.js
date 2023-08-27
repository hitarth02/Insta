const BASE_URL = process.env.REACT_APP_BASE_URL;

export const userApi = {
    GET_USER_DETAILS_API: BASE_URL + '/user/getUserDetails',
    UPDATE_USER_DETAILS_API: BASE_URL + '/user/updateUserDetails',
    UPDATE_USER_PICTURE_API: BASE_URL + '/user/updateUserPicture',
    GET_ALL_USERS_API: BASE_URL + '/user/getAllUsers',
    FOLLOW_USER_API: BASE_URL + '/user/followUser',
    UNFOLLOW_USER_API: BASE_URL + '/user/unFollowUser',
    SEARCH_USER_API: BASE_URL + '/user/searchUser',
    NOTIFICATIONS_API: BASE_URL + '/user/fetchNotifications',
};