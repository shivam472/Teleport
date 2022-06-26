import classes from "./Chat.module.css";
import AuthContext from "../contexts/authContext";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";

function Chat(props) {
  const { selectedFriend } = useContext(AuthContext);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedFriend) {
      try {
        // users (collection) -> currentUser -> Chats (subcollection) -> selectedFriend -> messages (subcollection)
        const currentUserChatCollectionRef = collection(
          db,
          "users",
          props.currentUser,
          "chats",
          selectedFriend,
          "messages"
        );

        // to sort the messages according to time
        const q = query(
          currentUserChatCollectionRef,
          orderBy("createdAt"),
          limit(50)
        );

        // retrieve theh messages
        onSnapshot(q, (snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  }, [selectedFriend]);

  const handleSendMessage = async () => {
    try {
      // users (collection) -> currentUser -> Chats (subcollection) -> selectedFriend
      const localUserChatDocRef = doc(
        db,
        "users",
        props.currentUser,
        "chats",
        selectedFriend
      );

      const remoteUserChatDocRef = doc(
        db,
        "users",
        selectedFriend,
        "chats",
        props.currentUser
      );

      // this code block is for adding some values in the document to make it active
      // otherwise the document won't show up in queries
      await setDoc(
        localUserChatDocRef,
        {
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await setDoc(
        remoteUserChatDocRef,
        {
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // creating a messages subcollection
      // users (collection) -> currentUser -> chats (subcollection) -> selectedFriend -> messages (subcollection)
      const localUserMessagesCollectionRef = collection(
        localUserChatDocRef,
        "messages"
      );
      const remoteUserMessagesCollectionRef = collection(
        remoteUserChatDocRef,
        "messages"
      );

      // add the message into the local user's database
      await addDoc(localUserMessagesCollectionRef, {
        createdAt: serverTimestamp(),
        from: props.currentUser,
        message: inputMessage,
      });

      // add the message into the remote user's database
      await addDoc(remoteUserMessagesCollectionRef, {
        createdAt: serverTimestamp(),
        from: props.currentUser,
        message: inputMessage,
      });

      setInputMessage("");
    } catch (error) {
      console.error(error.message);
    }
  };

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
          <div className={classes.chats}>
            {messages.map(({ from, message }, index) => (
              <div key={index} className={classes["message-container"]}>
                <div
                  className={`${classes.message} ${
                    classes[from === props.currentUser ? "sent" : "received"]
                  }`}
                >
                  {message}
                </div>
              </div>
            ))}
          </div>
          <div className={classes["send-message"]}>
            <input
              type={"text"}
              placeholder="Write a message..."
              className={classes["message--input"]}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <SendIcon
              style={{
                color: "#6C31FF",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
              onClick={handleSendMessage}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default Chat;
