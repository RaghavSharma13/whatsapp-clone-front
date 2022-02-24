import React, { useEffect, useState } from "react";

import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
  SearchOutlined,
} from "@mui/icons-material";

import { Avatar, IconButton } from "@material-ui/core";
import "./styles/Chat.css";
import { useParams } from "react-router";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  setCurrentRoom,
  sendMessage,
} from "../store/actions/chatActions";

const { REACT_APP_PUSHER_ID, REACT_APP_PUSHER_CLUSTER } = process.env;

const Chat = () => {
  const user = useSelector((root) => root.userReducer.user);
  const [input, setInput] = useState("");
  const { roomId, category } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    if (roomId) {
      try {
        dispatch(setCurrentRoom(roomId, category));
      } catch (e) {}
    }
  }, [roomId, category, dispatch]);

  const room = useSelector((root) => root.chatReducer.currentRoom);
  const messages = useSelector((root) => root.chatReducer.messages);

  useEffect(() => {
    const pusher = new Pusher(REACT_APP_PUSHER_ID, {
      cluster: REACT_APP_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("messages");

    channel.bind("updated", (data) => {
      dispatch(addMessage(data));
    });
    return () => {
      pusher.unsubscribe("messages");
    };
  }, [dispatch]);

  const submitMessage = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        sendMessage({
          _id: roomId,
          user_id: user._id,
          user_name: user.name,
          sentAt: `${new Date().toUTCString()}`,
          text: input,
        })
      );
    } catch (e) {}
    setInput("");
  };

  if (!room) {
    return null;
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{room.roomName}</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.length > 0 &&
          messages.map((message) => (
            <p
              key={message._id}
              className={`chat__message ${
                message.user_id === user._id && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.text}
              <span className="chat__timestamp">{message.timestamp}</span>
            </p>
          ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={submitMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
          <Mic />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;
