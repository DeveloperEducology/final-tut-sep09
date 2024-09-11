import * as auth from "./auth";
import * as posts from "./posts";
import * as comments from "./comments";
import * as messages from "./messages";
import * as chat from './chat';

// import * as isFirstTime from './isFirstTime';
export default {
  ...auth,
  ...posts,
  ...comments,
  ...messages,
  ...chat
  // ...isFirstTime
};
