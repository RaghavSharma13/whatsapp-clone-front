import axios from "../../components/axios";
import { updateRooms } from "./userActions";

export const chatActions = {
  SET_ALL_CHAT_GROUPS: "SetAllChatGroups",
  SET_CURRENT_ROOM: "SetCurrentRoom",
  SET_MESSAGES: "SetMessages",
  ADD_MESSAGE: "AddMessage",
  ADD_CHAT_GROUP: "AddChatGroup",
  ADD_JOINED_CHAT: "AddJoinedChat",
};

export const setAllChatGroups = () => {
  return async (dispatch, getState) => {
    const user = getState().userReducer.user;

    const response = await axios.get("/user/getchats", {
      params: {
        _id: user._id,
      },
    });

    if (!response.statusText === "OK") {
      throw new Error("Bad Response");
    }

    await dispatch({
      type: chatActions.SET_ALL_CHAT_GROUPS,
      createdRooms: response.data.createdChats,
      joinedRooms: response.data.joinedChats,
    });
  };
};

export const addNewChatGroup = (chat) => {
  return async (dispatch) => {
    const res = await axios.post("/user/addChat", {
      _id: chat.userId,
      roomName: chat.roomName,
      createdBy: chat.createdBy,
      roomCode: chat.roomCode,
    });

    if (res.status !== 201) {
      throw new Error("Couldn't create a new Chat");
    }

    await dispatch(
      updateRooms({
        _id: res.data._id,
        type: "created",
      })
    );

    dispatch({
      type: chatActions.ADD_CHAT_GROUP,
      chat: {
        roomName: res.data.roomName,
        _id: res.data._id,
        roomCode: res.data.roomCode,
      },
    });
  };
};

export const joinChatGroup = (data) => {
  return async (dispatch, getState) => {
    const userId = getState().userReducer.user._id;

    const res = await axios.post("/room/join", { data, userId });

    if (res.status !== 200) throw new Error("Something went wrong");

    await dispatch(
      updateRooms({
        _id: res.data._id,
        type: "joined",
      })
    );

    dispatch({
      type: chatActions.ADD_JOINED_CHAT,
      chat: res.data,
    });
  };
};

export const setMessages = () => {
  return async (dispatch, getState) => {
    const room = getState().chatReducer.currentRoom;

    const response = await axios.get("/room/getMsgs", {
      params: {
        _id: room._id,
      },
    });

    if (response.statusText !== "OK") {
      throw new Error("Bad Request couldn't fetch messages");
    }

    dispatch({
      type: chatActions.SET_MESSAGES,
      messages: response.data,
    });
  };
};

export const setCurrentRoom = (roomId, category) => {
  return async (dispatch, getState) => {
    const rooms =
      category === "created"
        ? getState().userReducer.user.createdRooms
        : getState().userReducer.user.joinedRooms;

    const currentRoom = rooms.find((el) => el === roomId);

    if (!currentRoom) {
      throw new Error(`No room with id ${roomId} found`);
    }

    const response = await axios.get("/room", {
      params: {
        _id: roomId,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Bad Request. No room found`);
    }

    await dispatch({
      type: chatActions.SET_CURRENT_ROOM,
      currentRoom: { ...response.data, type: category },
    });

    dispatch(setMessages());
  };
};

export const addMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: chatActions.ADD_MESSAGE,
      message,
    });
  };
};

export const sendMessage = (message) => {
  return async (_dispatch) => {
    const res = await axios.post("/room/sendMsg", message);

    if (res.status !== 201) {
      throw new Error("Couldn't send the message.");
    }
  };
};
