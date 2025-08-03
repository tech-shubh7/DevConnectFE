import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice"
import connectionReducer from "./connectionSlice"
import requestSlice from "./requestSlice"

const appStore=configureStore({
  reducer: {
    user:userReducer,
    feed:feedReducer,
    connections:connectionReducer,
    requests:requestSlice
  }
});

export default appStore;