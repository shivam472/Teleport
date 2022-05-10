import classes from "./Chat.module.css";
import AuthContext from "../contexts/authContext";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Peer from "peerjs";

function Chat(props) {
  const { selectedFriend, peerInstance } = useContext(AuthContext);

  // useEffect(() => {
  //   const peer = new Peer();

  //   // add current user's peer id to database
  //   const addToDB = async (id) => {
  //     try {
  //       const docRef = doc(db, "users", props.currentUser);
  //       await updateDoc(docRef, {
  //         peerId: id,
  //       });
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };

  //   peer.on("open", (id) => {
  //     if (props.currentUser) addToDB(id);
  //   });

  //   peerInstance.current = peer;
  // }, [props.currentUser]);

  // const handleCall = async () => {
  //   if (selectedFriend) {
  //     const receiverRef = doc(db, "users", selectedFriend);

  //     // try {
  //     //   await updateDoc(receiverRef, {
  //     //     notification: {
  //     //       caller: props.currentUser,
  //     //       incomingCall: true,
  //     //     },
  //     //   });
  //     // } catch (error) {
  //     //   console.log(error.message);
  //     // }

  //     // get the peerId of the receiver from the database
  //     const docSnap = await getDoc(receiverRef);
  //     const docData = docSnap.data();
  //     const remotePeerId = docData.peerId;
  //     console.log("remotePeerId: ", remotePeerId);

  //     //   const getUserMedia =
  //     //     navigator.getUserMedia ||
  //     //     navigator.webkitGetUserMedia ||
  //     //     navigator.mozGetUserMedia;
  //     try {
  //       const mediaStream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //         audio: true,
  //       });
  //       console.log("mediaStream: ", mediaStream);
  //       // props.localVideoRef.current.srcObject = mediaStream;
  //       // props.localVideoRef.current.play();

  //       const call = await peerInstance.current.call(remotePeerId, mediaStream);

  //       props.setLocalVideo(mediaStream);

  //       call.on("stream", (remoteStream) => {
  //         console.log("inside call.on(stream)");
  //         props.setRemoteVideo(remoteStream);
  //       });
  //     } catch (err) {
  //       console.log(err.message);
  //     }

  //     //   getUserMedia({ video: true, audio: true }, (mediaStream) => {
  //     //     props.localVideoRef.current.srcObject = mediaStream;
  //     //     props.localVideoRef.current.play();

  //     //     const call = peerInstance.current.call(remotePeerId, mediaStream);
  //     //   });

  //     // view remote user's video when calling the remote user
  //     //   getUserMedia(
  //     //     { video: true, audio: true },
  //     //     (mediaStream) => {
  //     //       const call = peerInstance.current.call(remotePeerId, mediaStream);
  //     //       console.log("call", call);
  //     //       call.on("stream", (remoteStream) => {
  //     //         console.log("remote stream: ", remoteStream);
  //     //         // props.setRemoteVideo(remoteStream);
  //     //         props.remoteVideoRef.current.srcObject = remoteStream;
  //     //         props.remoteVideoRef.current.play();
  //     //       });
  //     //     },
  //     //     (err) => {
  //     //       console.log("Failed to get local stream", err);
  //     //     }
  //     //   );
  //   }
  // };

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
          onClick={() => props.call(selectedFriend)}
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
