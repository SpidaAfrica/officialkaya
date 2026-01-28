import { combineReducers } from "redux";
import authSlice from "./slices/auth";
import modalSlice from "./slices/modal";
import notificationSlice from "./slices/notification";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  modal: modalSlice.reducer,
  notification: notificationSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
