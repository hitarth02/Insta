const BASE_URL = process.env.REACT_APP_BASE_URL;


export const postApi = {
    CREATE_POST_API: BASE_URL + '/post/createPost',
    GET_SINGLE_POST_API: BASE_URL + '/post/getSinglePost',
    GET_ALL_POSTS_API: BASE_URL + `/post/getAllPosts`,
    LIKE_POST_API: BASE_URL + '/post/likePost',
    UNLIKE_POST_API: BASE_URL + '/post/unLikePost',
    SAVE_POST_API: BASE_URL + '/post/savePost',
    UN_SAVE_POST_API: BASE_URL + '/post/unSavePost',
    ADD_COMMENT_API: BASE_URL + '/post/addComment',
    DELETE_COMMENT_API: BASE_URL + '/post/removeComment',
    DELETE_POST_API: BASE_URL + '/post/deletePost',

    CREATE_REEL_API: BASE_URL + '/post/createReel',
    GET_ALL_REELS_API: BASE_URL + '/post/getAllReels',
};