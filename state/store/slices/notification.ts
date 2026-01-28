import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { BellRinging1 } from "@/assets/svgs";

const initialNotificationState: NotificationState = {
  show: false,
  message: "",
  // icon: BellRinging1,
  type: "info",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    triggerNotification: (
      state,
      action: PayloadAction<TriggerNotification>
    ) => {
      const {
        message,
        show,
        type = "info",
        // icon = BellRinging1,
        // children,
      } = action.payload;

      console.log("TRIGGER_MODAL: ", action.payload);

      return {
        ...state,
        show: show !== undefined ? show : !state.show,
        message: message,
        type,
        // icon,
      };
    },

    closeNotification() {
      return initialNotificationState;
    },
  },
});

export const { triggerNotification, closeNotification } =
  notificationSlice.actions;
export default notificationSlice;
