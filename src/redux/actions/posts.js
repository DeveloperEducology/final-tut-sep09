import {
  ALL_POSTS,
  CREATE_POST,
  LIKE_DISLIKE,
  MY_POSTS,
  GET_COLLECTIONS,
  FETCH_PARENT_BY_ID,
  FETCH_TUTOR_BY_ID
} from "../../config/urls";
import { apiGet, apiPost } from "../../utils/utils";
import store from "../store";

export const createPost = (data) => {
  return apiPost(CREATE_POST, data);
};

export const getAllPost = (query = "") => {
  return apiGet(ALL_POSTS + query);
};

export const getMyPosts = (query = "") => {
  return apiGet(MY_POSTS + query);
};
export const getParentProfile = (query = "") => {
  return apiGet(FETCH_PARENT_BY_ID + query);
};
export const getTutorProfile = (query = "") => {
  return apiGet(FETCH_TUTOR_BY_ID + query);
};



export const getCollections = (query = "") => {
  return apiGet(GET_COLLECTIONS + query);
};

export const likeDislike = (data) => {
  return apiPost(LIKE_DISLIKE, data);
};
