import axios from "../../components/axios";
import { setAllChatGroups } from "./chatActions";

export const userActionTypes = {
  SET_USER: "SET_USER",
  UPDATE_ROOMS: "UPDATE_ROOMS",
};

export const setUser = (googleProfile) => {
  return async (dispatch) => {
    const res = await axios.post("/signUser", googleProfile);

    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Couldn't sign in the user");
    }

    await dispatch({ type: userActionTypes.SET_USER, user: res.data });
    await dispatch(setAllChatGroups());
  };
};

export const checkUser = () => {
  return async (dispatch) => {
    const response = await axios.get("/user/checkExistingUser");

    if (response.status === 400) {
      return;
    }

    await dispatch({
      type: userActionTypes.SET_USER,
      user: response.data,
    });
    dispatch(setAllChatGroups());
  };
};

export const updateRooms = (room) => {
  return async (dispatch) => {
    dispatch({
      type: userActionTypes.UPDATE_ROOMS,
      roomType: room.type,
      roomId: room._id,
    });
  };
};
