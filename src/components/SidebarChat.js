import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import "./styles/SidebarChat.css";

const SidebarChat = ({ roomName, id, category }) => {
  return (
    <Link to={`/rooms/${category}/${id}`}>
      <div className="sidebarChat">
        <Avatar />
        <div className="sidebarChat__info">
          <h2>{roomName}</h2>
          <p>This is the last message of the room</p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChat;
