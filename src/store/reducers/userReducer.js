import { userActionTypes } from "../actions/userActions";

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userActionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case userActionTypes.UPDATE_ROOMS: {
      const updatedUser = state.user;

      if (action.roomType === "created") {
        updatedUser.createdRooms = updatedUser.createdRooms.concat(
          action.roomId
        );
      } else {
        updatedUser.joinedRooms = updatedUser.joinedRooms.concat(action.roomId);
      }

      return {
        ...state,
        user: updatedUser,
      };
    }
    default:
      return state;
  }
};

export default reducer;
