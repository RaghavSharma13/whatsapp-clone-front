import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewChatGroup, joinChatGroup } from "../store/actions/chatActions";
import "./styles/Form.css";

const FormItem = ({
  label,
  placeholder,
  value,
  onValueChanged,
  message,
  error,
  ...rest
}) => {
  return (
    <div className="FormItem">
      <div className="FormItem__main">
        {error.status && (
          <p className="FormItem__message errorMsg">{error.msg}</p>
        )}
        <label className="FormItem__label">{label}</label>
        <input
          className={`FormItem__input ${error.status && "errorItem"}`}
          placeholder={placeholder}
          {...rest}
          value={value}
          onChange={onValueChanged}
        />
        <p className="FormItem__message">{message}</p>
      </div>
    </div>
  );
};

const Form = ({ create, PostSubmit, onCancel }) => {
  const initialState = {
    userMail: "",
    roomName: "",
    roomPassword: "",
    roomCode: "",
  };
  const [state, setState] = useState(initialState);

  const initialErrors = {
    userMailError: {
      status: false,
      msg: "",
    },
    roomNameError: {
      status: false,
      msg: "",
    },
    roomPasswordError: {
      status: false,
      msg: "",
    },
    roomCodeError: {
      status: false,
      msg: "",
    },
  };

  const [errors, setErrors] = useState(initialErrors);

  const user = useSelector((root) => root.userReducer.user);
  const rooms = useSelector((root) => root.chatReducer.allChatGroups.created);

  const dispatch = useDispatch();

  const mailValidation = () => {
    if (!/^([A-Za-z0-9_\-.])+@([gmail|GMAIL])+.(com)$/.test(state.userMail)) {
      setErrors((prevState) => ({
        ...prevState,
        userMailError: {
          status: true,
          msg: "Please enter a valid GMAIL ID",
        },
      }));

      return true;
    }
    if (state.userMail === user.fullName) {
      setErrors((prevState) => ({
        ...prevState,
        userMailError: {
          status: true,
          msg: "You can't join a room created by yourself!!",
        },
      }));

      return true;
    }

    return false;
  };

  const validateEnteries = () => {
    let errorsPresent = false;

    // usermail validations
    errorsPresent = !create && mailValidation();

    if (create && !state.roomName) {
      setErrors((prevState) => ({
        ...prevState,
        roomNameError: {
          status: true,
          msg: "This is a required field!",
        },
      }));
      errorsPresent = true;
    } else if (
      create &&
      rooms.find((room) => room.roomName === state.roomName)
    ) {
      setErrors((prevState) => ({
        ...prevState,
        roomNameError: {
          status: true,
          msg: "You have already created a room with this name. Please use another name.",
        },
      }));
      errorsPresent = true;
    }
    if (!state.roomCode) {
      setErrors((prevState) => ({
        ...prevState,
        roomCodeError: {
          status: true,
          msg: "This is a required field!",
        },
      }));

      errorsPresent = true;
    } else if (create && rooms.find((room) => room.code === state.roomCode)) {
      setErrors((prevState) => ({
        ...prevState,
        roomCodeError: {
          status: true,
          msg: "You are already using the given code. Please enter another.",
        },
      }));
      errorsPresent = true;
    }
    if (!state.roomPassword) {
      setErrors((prevState) => ({
        ...prevState,
        roomPasswordError: {
          status: true,
          msg: "This is a required field!",
        },
      }));

      errorsPresent = true;
    }

    return errorsPresent;
  };

  const clearState = () => {
    setState(initialState);
  };

  const onSubmitClicked = async () => {
    setErrors(initialErrors);

    if (validateEnteries()) {
      return;
    }

    if (create) {
      try {
        await dispatch(
          addNewChatGroup({
            roomName: state.roomName,
            roomCode: state.roomCode,
            userId: user._id,
            createdBy: user.name,
          })
        );
        PostSubmit();
      } catch (e) {}
    } else {
      try {
        await dispatch(
          joinChatGroup({
            owner: state.userMail,
            roomPassword: state.roomPassword,
            roomCode: state.roomCode,
          })
        );
        PostSubmit();
      } catch (e) {}
    }
    clearState();
  };

  return (
    <div className="chatForm">
      {!create && (
        <FormItem
          label={"Owner's Gmail id"}
          placeholder={"example@gmail.com"}
          value={state.userMail}
          onValueChanged={(e) =>
            setState((prevState) => ({
              ...prevState,
              userMail: e.target.value,
            }))
          }
          error={errors.userMailError}
        />
      )}

      {create && (
        <FormItem
          label={"Chat Name"}
          placeholder="First Room"
          value={state.roomName}
          onValueChanged={(e) =>
            setState((prevState) => ({
              ...prevState,
              roomName: e.target.value,
            }))
          }
          error={errors.roomNameError}
        />
      )}

      <FormItem
        label={"Password"}
        placeholder={"123xy@z"}
        value={state.roomPassword}
        onValueChanged={(e) =>
          setState((prevState) => ({
            ...prevState,
            roomPassword: e.target.value,
          }))
        }
        minLength={6}
        maxLength={12}
        type="password"
        message={"Password should be between 6 to 12 characters long."}
        error={errors.roomPasswordError}
      />

      <FormItem
        label={"Code"}
        placeholder="1Room"
        value={state.roomCode}
        onValueChanged={(e) =>
          setState((prevState) => ({
            ...prevState,
            roomCode: e.target.value,
          }))
        }
        minLength={3}
        maxLength={6}
        message={"Code should be between 3 to 6 characters long."}
        error={errors.roomCodeError}
      />

      <div className="chatForm__buttonWrapper">
        <button
          className="chatForm__button positive"
          onClick={() => {
            onSubmitClicked();
          }}
        >
          {create ? "Create" : "Join"}
        </button>
        <button
          className="chatForm__button negative"
          onClick={() => {
            clearState();
            setErrors(initialErrors);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Form;
