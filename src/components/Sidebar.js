import { Avatar, IconButton } from "@material-ui/core";
import {
  Add,
  Comment,
  DonutLarge,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Form from "./Form";
import Modal from "./Modal";
import SidebarChat from "./SidebarChat";
import "./styles/Sidebar.css";

const Sidebar = () => {
  const createdRooms = useSelector(
    (root) => root.chatReducer.allChatGroups.created
  );
  const joinedRooms = useSelector(
    (root) => root.chatReducer.allChatGroups.joined
  );

  const user = useSelector((root) => root.userReducer.user);

  const currentRoom = useSelector((root) => root.chatReducer.currentRoom);

  const [chatType, setChatType] = useState("created");
  const [modalDisplay, setModalDisplay] = useState(false);
  const [createOrJoin, setCreateOrJoin] = useState("");

  useEffect(() => {
    if (currentRoom) {
      setChatType(currentRoom.type);
    }
  }, [currentRoom, setChatType]);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__header">
          <Avatar src={user.imageURL} />

          <div className="sidebar__headerRight">
            <IconButton
              title="Join"
              onClick={() => {
                setModalDisplay(true);
                setCreateOrJoin("join");
              }}
            >
              <Comment />
            </IconButton>
            <IconButton title="Status">
              <DonutLarge />
            </IconButton>
            <IconButton
              title="Create Chat"
              onClick={() => {
                setModalDisplay(true);
                setCreateOrJoin("create");
              }}
            >
              <Add />
            </IconButton>
            <IconButton title="Options">
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <div className="sidebar__search">
          <div className="sidebar__searchContainer">
            <SearchOutlined />
            <input placeholder="Search or start new chat" type="text" />
          </div>
        </div>

        <div className="sidebar__chatType">
          <div
            className={`chatType ${chatType === "created" && "active"}`}
            onClick={() => setChatType("created")}
          >
            Created
          </div>
          <div
            className={`chatType ${chatType === "joined" && "active"}`}
            onClick={() => setChatType("joined")}
          >
            Joined
          </div>
        </div>

        <div className="sidebar__chats">
          {chatType === "created"
            ? createdRooms.map(({ _id, roomName }) => (
                <SidebarChat
                  key={_id}
                  roomName={roomName}
                  id={_id}
                  category={chatType}
                />
              ))
            : joinedRooms.map(({ _id, roomName }) => (
                <SidebarChat
                  key={_id}
                  roomName={roomName}
                  id={_id}
                  category={chatType}
                />
              ))}
        </div>
      </div>
      <Modal displayMode={modalDisplay} modalTitle={"Add New Chat"}>
        {createOrJoin === "create" ? (
          <Form
            create
            PostSubmit={() => {
              setModalDisplay(false);
            }}
            onCancel={() => setModalDisplay(false)}
          />
        ) : (
          <Form
            PostSubmit={() => setModalDisplay(false)}
            onCancel={() => setModalDisplay(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default Sidebar;
