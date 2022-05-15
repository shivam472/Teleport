import classes from "./Chat.module.css";
import AuthContext from "../contexts/authContext";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";

function Chat(props) {
  const { selectedFriend } = useContext(AuthContext);

  return (
    <section className={classes["chat--section"]}>
      {!selectedFriend && (
        <div className={classes["default--message"]}>
          <h2>Select a friend to start chatting.</h2>
        </div>
      )}
      {selectedFriend && (
        <>
          <div className={classes["chat--header"]}>
            <h1 className={classes["selected--friend"]}>{selectedFriend}</h1>
            <VideoCallIcon
              style={{
                color: "#2374E1",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
              onClick={() => {
                props.call(selectedFriend);
                props.setCalling(true);
              }}
            />
          </div>
          <div className={classes["chat"]}>
            <input
              type={"text"}
              placeholder="Write a message..."
              className={classes["message--input"]}
            />
            <SendIcon
              style={{
                color: "#6C31FF",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default Chat;
