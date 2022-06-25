import classes from "./MainComponent.module.css";
import Friends from "./Friends";
import { useRef, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import AuthContext from "../contexts/authContext";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import Chat from "./Chat";
import NotificationModal from "./NotificationModal";
import notifysound from "../assets/notifysound.mp3";
import Peer from "peerjs";
import CallEndIcon from "@mui/icons-material/CallEnd";

const MainComponent = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(false);
  const currentUserVideoRef = useRef();
  const remoteUserVideoRef = useRef();
  const callRef = useRef(null);
  const {
    showCallNotification,
    callNotification,
    peerInstance,
    selectedFriend,
  } = useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUser(currentUser.email);
      } else console.log("user is signed out");
    });
  });
  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      console.log("id: ", id);
    });

    peerInstance.current = peer;
  }, []);

  useEffect(() => {
    if (currentUser !== "" && selectedFriend !== "") {
      const currentUserRef = doc(db, "users", currentUser);
      const remoteUserRef = doc(db, "users", selectedFriend);

      onSnapshot(currentUserRef, async (doc) => {
        const docData = doc.data();
        console.log("docData: ", docData);
        if (docData.call === "call-end") {
          const currentUserMediaStream = currentUserVideoRef.current.srcObject;
          const remoteUserMediaStream = remoteUserVideoRef.current.srcObject;

          console.log("currentUserMediaStream: ", currentUserMediaStream);
          console.log("remoteUserMediaStream: ", remoteUserMediaStream);

          // get the active media stream(audio and video) and close each of them
          currentUserMediaStream.getTracks().forEach((track) => {
            track.stop();
          });
          remoteUserMediaStream.getTracks().forEach((track) => {
            track.stop();
          });

          setCalling(false);
          setCallAccepted(false);

          try {
            await updateDoc(currentUserRef, {
              call: "inactive",
            });
            await updateDoc(remoteUserRef, {
              call: "inactive",
            });
          } catch (error) {
            console.log(error.message);
          }
        } else if (docData.call === "call-declined") {
          const currentUserMediaStream = currentUserVideoRef.current.srcObject;

          console.log("currentUserMediaStream: ", currentUserMediaStream);

          // get the active media stream(audio and video) and close each of them
          currentUserMediaStream.getTracks().forEach((track) => {
            track.stop();
          });

          setCalling(false);
          setCallAccepted(false);

          try {
            await updateDoc(currentUserRef, {
              call: "inactive",
            });
            await updateDoc(remoteUserRef, {
              call: "inactive",
            });
          } catch (error) {
            console.log(error.message);
          }
        }
      });
    }
  });

  useEffect(() => {
    console.log("inside useEffect");
    console.log("currentUser: ", currentUser);

    // add current user's peer id to database
    const addToDB = async (id) => {
      try {
        if (currentUser !== "") {
          const docRef = doc(db, "users", currentUser);
          await updateDoc(docRef, {
            peerId: id,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    peerInstance.current.on("open", (id) => {
      addToDB(id);
    });
  }, [currentUser]);

  useEffect(() => {
    const handleCallReceive = async () => {
      if (callAccepted) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          callRef.current.answer(mediaStream);
          callRef.current.on("stream", (remoteStream) => {
            console.log("remoteStream answer: ", remoteStream);
            remoteUserVideoRef.current.srcObject = remoteStream;
            remoteUserVideoRef.current.play();
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    handleCallReceive();
  }, [callAccepted]);

  useEffect(() => {
    // when the current user receives a call
    peerInstance.current.on("call", (call) => {
      console.log("inside peer.on(call)");
      const notificationSound = new Audio(notifysound);
      notificationSound.play();
      showCallNotification();

      callRef.current = call;
    });
  }, []);

  // when the user calls someone
  const handleCall = async (friendSelected) => {
    if (friendSelected) {
      const callerRef = doc(db, "users", currentUser);
      const receiverRef = doc(db, "users", friendSelected);

      // get the peerId of the receiver(remote user) from the database
      const docSnap = await getDoc(receiverRef);
      const docData = docSnap.data();
      const remotePeerId = docData.peerId;
      console.log("remotePeerId: ", remotePeerId);

      try {
        await updateDoc(callerRef, {
          call: "active",
        });
        await updateDoc(receiverRef, {
          call: "active",
          notification: {
            caller: currentUser,
          },
        });
      } catch (error) {
        console.log(error.message);
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("mediaStream: ", mediaStream);
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, mediaStream);
        call.on("stream", (remoteStream) => {
          console.log("remoteStream: ", remoteStream);
          remoteUserVideoRef.current.srcObject = remoteStream;
          remoteUserVideoRef.current.play();
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleEndCall = async () => {
    const currentUserRef = doc(db, "users", currentUser);
    const remoteUserRef = doc(db, "users", selectedFriend);
    try {
      await updateDoc(currentUserRef, {
        call: "call-end",
      });
      await updateDoc(remoteUserRef, {
        call: "call-end",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log("calling: ", calling);
  console.log("callAccepted: ", callAccepted);

  return (
    <div className={classes.main}>
      <Friends user={currentUser} />
      <Chat
        currentUser={currentUser}
        call={handleCall}
        setCalling={setCalling}
      />
      {callNotification && (
        <NotificationModal
          currentUser={currentUser}
          setCallStatus={setCallAccepted}
        />
      )}

      {(calling || callAccepted) && (
        <div className={classes["videoOverlay"]}>
          <div className={classes["video--container"]}>
            <div className={classes["currentUserVideo"]}>
              <video
                width="100%"
                className="video"
                ref={currentUserVideoRef}
                autoPlay
                muted
                playsInline
              />
            </div>
            <div className={classes["remoteUserVideo"]}>
              <video
                width="100%"
                ref={remoteUserVideoRef}
                autoPlay
                playsInline
              />
            </div>
          </div>
          <div className={classes["callEnd"]}>
            <CallEndIcon
              style={{
                color: "white",
                backgroundColor: "red",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                marginTop: "50px",
              }}
              onClick={handleEndCall}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
