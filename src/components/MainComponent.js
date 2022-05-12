import classes from "./MainComponent.module.css";
import Friends from "./Friends";
import { useRef, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import AuthContext from "../contexts/authContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Chat from "./Chat";
import NotificationModal from "./NotificationModal";
import notifysound from "../assets/notifysound.mp3";
import Peer from "peerjs";
import CallerVideoOverview from "./CallerVideoOverview";
import ReceiverVideoOverview from "./ReceiverVideoOverview";

const MainComponent = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(false);
  const [peerId, setPeerId] = useState("");
  const currentUserVideoRef = useRef();
  const remoteUserVideoRef = useRef();
  const callRef = useRef(null);
  const { showCallNotification, callNotification, peerInstance } =
    useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser.email);
    });

    const peer = new Peer();

    peer.on("open", (id) => {
      console.log("id: ", id);
    });

    peerInstance.current = peer;
  }, []);

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
      setPeerId(id);
    });
  }, [currentUser]);

  useEffect(() => {
    const handleCallReceive = async () => {
      if (callAccepted) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
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
    peerInstance.current.on("call", (call) => {
      console.log("inside peer.on(call)");
      const notificationSound = new Audio(notifysound);
      notificationSound.play();
      showCallNotification();

      callRef.current = call;
    });
  }, []);

  const handleCall = async (selectedFriend) => {
    if (selectedFriend) {
      const receiverRef = doc(db, "users", selectedFriend);

      // get the peerId of the receiver from the database
      const docSnap = await getDoc(receiverRef);
      const docData = docSnap.data();
      const remotePeerId = docData.peerId;
      console.log("remotePeerId: ", remotePeerId);

      try {
        await updateDoc(receiverRef, {
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
        });
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

      {/* {calling && (
        <div className={classes["video--container"]}>
          <div>
            currentUserVideo
            <video
              ref={currentUserVideoRef}
              playsInline
              width={300}
              height={300}
              muted
            />
          </div>
        </div>
      )} */}

      {(calling || callAccepted) && (
        <div className={classes["video--container"]}>
          <div className={classes["currentUserVideo"]}>
            <div>
              <video
                ref={currentUserVideoRef}
                playsInline
                width={600}
                height={600}
                muted
              />
            </div>
          </div>
          <div className={classes["remoteUserVideo"]}>
            <div>
              <video
                ref={remoteUserVideoRef}
                autoPlay
                playsInline
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
