import classes from "./NotificationModal.module.css";
import Button from "@mui/material/Button";
import AuthContext from "../contexts/authContext";
import { useContext } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

function NotificationModal(props) {
  const { hideCallNotification, peerInstance } = useContext(AuthContext);

  const handleDecline = async () => {
    try {
      hideCallNotification();
      const receiverRef = doc(db, "users", props.user);
      await updateDoc(receiverRef, {
        notification: {
          caller: "",
          incomingCall: false,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAccept = async () => {
    // const getUserMedia =
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia;

    // console.log("inside handleAccept, peerinstance: ", peerInstance);
    peerInstance.current.on("call", (call) => {
      console.log("inside peerInstance.current.on(call)");
      const mediaStream = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      call.answer(mediaStream);
      call.on("stream", (remoteStream) => {
        props.setRemoteVideo(remoteStream);
      });
      // navigator.mediaDevices.getUserMedia(
      //   { video: true, audio: true },
      //   (mediaStream) => {
      //     props.setLocalVideo(mediaStream);
      //     call.answer(mediaStream); // Answer the call with an A/V stream.
      //     call.on("stream", (remoteStream) => {
      //       props.setRemoteVideo(remoteStream);
      //     });
      //   },
      //   (err) => {
      //     console.log("Failed to get local stream", err);
      //   }
      // );
    });

    // // view current user's video
    // const mediaStream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
    // const call = await peerInstance.current.on("call", (call) => call);
    // props.setLocalVideo(mediaStream);
    // call.answer(mediaStream);

    // // view remote user's video
    // const remoteStream = await call.on(
    //   "stream",
    //   (remoteStream) => remoteStream
    // );
    // console.log("remoteStream: ", remoteStream);
    // props.setRemoteVideo(remoteStream);

    handleDecline();
  };

  return (
    <div className={classes["modal--overlay"]}>
      <div className={classes["modal--container"]}>
        <div className={classes.title}>
          <h1>Incoming video call from {props.caller} </h1>
        </div>
        <div className={classes.footer}>
          <Button
            variant="outlined"
            style={{ marginRight: "5px" }}
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            style={{ marginLeft: "5px" }}
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
