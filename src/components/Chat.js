import classes from "./Chat.module.css";
import AuthContext from "../contexts/authContext";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

function Chat(props) {
  const { selectedFriend } = useContext(AuthContext);

  const handleVideoCall = async () => {
    try {
      const receiverRef = doc(db, "users", selectedFriend);
      await updateDoc(receiverRef, {
        notification: {
          caller: props.user,
          incomingCall: true,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className={classes["chat--section"]}>
      <div className={classes["chat--header"]}>
        <h1 className={classes["selected--friend"]}>{selectedFriend}</h1>
        <VideoCallIcon
          style={{
            color: "#2374E1",
            width: "30px",
            height: "30px",
            cursor: "pointer",
          }}
          onClick={handleVideoCall}
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
    </section>
  );
}

export default Chat;
