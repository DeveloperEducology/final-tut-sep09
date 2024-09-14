export const API_BASE_URL = "http://192.168.29.247:3000";
// export const API_BASE_URL = "https://tutbackend-udp2ofdb.b4a.run";



export const getApiURL = (endpoint) => API_BASE_URL + endpoint;

export const SIGNUP_API = getApiURL("/signup");
export const LOGIN_API = getApiURL("/login");
export const OTP_API = getApiURL("/otp-less");
// export const LOGIN_API = getApiURL("/otp-less");
// export const OTP_VERIFY = getApiURL("/otpVerify");
export const OTP_VERIFY = getApiURL("/verifyOTP-less");
export const CREATE_POST = getApiURL("/createPost");
export const ALL_POSTS = getApiURL("/allPost");
export const MY_POSTS = getApiURL("/myPosts");
export const FILE_UPLOAD = getApiURL("/fileUpload");
export const USER_DETAILS = getApiURL("/fetchUserDetails");
export const FETCH_USERS_BY_IDS = getApiURL("/fetchUsersByIds");
export const FETCH_PARENT_BY_ID = getApiURL("/parent-profile");


// get collections
export const GET_COLLECTIONS = getApiURL("/collections")

//post like_dislike apis
export const LIKE_DISLIKE = getApiURL("/likeDislike");

//comment apis
export const ADD_COMMENT = getApiURL("/addComment");
export const POST_COMMENTS = getApiURL("/postComments");
export const DELETE_COMMENT = getApiURL("/deleteComment");

//chat apis
export const CREATE_PRIVATE_CHAT = getApiURL("/createPrivateChat");
export const CREATE_GROUP_CHAT = getApiURL("/createGroupChat");
export const MY_CHATS = getApiURL("/myChats");
export const CHAT_BY_ID = getApiURL("/chatById");

//messages apis
export const SEND_MESSAGE = getApiURL("/sendMessage");
export const MY_MESSAGES = getApiURL("/myMessages");
