import { chatActions } from "../actions/chatActions";

const initialState = {
  allChatGroups: {
    created: [],
    joined: [],
  },
  currentRoom: null,
  messages: [],
};

// allChatGroups will update when the user is found either by login or cookie
// currentRoom will update when we route to a particular chat room
// messages will update with currentRoom

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case chatActions.SET_ALL_CHAT_GROUPS: {
      const updatedChatGroups = state.allChatGroups;
      updatedChatGroups.created = action.createdRooms;
      updatedChatGroups.joined = action.joinedRooms;

      return {
        ...state,
        allChatGroups: updatedChatGroups,
      };
    }

    case chatActions.ADD_CHAT_GROUP: {
      const updatedChatGroups = state.allChatGroups;
      updatedChatGroups.created = updatedChatGroups.created.concat(action.chat);

      return {
        ...state,
        allChatGroups: updatedChatGroups,
      };
    }

    case chatActions.ADD_JOINED_CHAT: {
      const updatedChatGroups = state.allChatGroups;
      updatedChatGroups.joined = updatedChatGroups.joined.concat(action.chat);

      return {
        ...state,
        allChatGroups: updatedChatGroups,
      };
    }

    case chatActions.SET_CURRENT_ROOM: {
      return {
        ...state,
        currentRoom: action.currentRoom,
      };
    }

    case chatActions.SET_MESSAGES: {
      return {
        ...state,
        messages: action.messages,
      };
    }
    case chatActions.ADD_MESSAGE: {
      return {
        ...state,
        messages: state.messages.concat(action.message),
      };
    }
    default:
      return state;
  }
};

export default reducer;
