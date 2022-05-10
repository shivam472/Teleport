import classes from "./MainComponent.module.css";
import Friends from "./Friends";
import { useRef, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import AuthContext from "../contexts/authContext";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import Chat from "./Chat";
import NotificationModal from "./NotificationModal";
import notifysound from "../assets/notifysound.mp3";
import Peer from "peerjs";
import CallerVideoOverview from "./CallerVideoOverview";
import ReceiverVideoOverview from "./ReceiverVideoOverview";

const MainComponent = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [caller, setCaller] = useState("");
  const [peerId, setPeerId] = useState("");
  //   const [currentUserVideo, setCurrentUserVideo] = useState(null);
  //   const [remoteUserVideo, setRemoteUserVideo] = useState(null);
  const currentUserVideoRef = useRef(null);
  const remoteUserVideoRef = useRef(null);
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
    // onAuthStateChanged(auth, (currentUser) => {
    //   setCurrentUser(currentUser.email);
    // });

    console.log("inside useEffect");
    console.log("currentUser: ", currentUser);
    // const peer = new Peer();

    // peer.on("open", (id) => {
    //   console.log("id: ", id);
    // });

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

    // peerInstance.current.on("call", (call) => {
    //   console.log("inside peer.on(call)");
    //   const getUserMedia =
    //     navigator.mediaDevices.getUserMedia ||
    //     navigator.mediaDevices.webkitGetUserMedia ||
    //     navigator.mediaDevices.mozGetUserMedia;
    //   getUserMedia(
    //     {
    //       video: true,
    //     },
    //     (mediaStream) => {
    //       console.log("inside useEffect getUserMedia");
    //       currentUserVideoRef.current.srcObject = mediaStream;
    //       currentUserVideoRef.current.play();
    //       call.answer(mediaStream);
    //       call.on("stream", (remoteStream) => {
    //         remoteUserVideoRef.current.srcObject = remoteStream;
    //         remoteUserVideoRef.current.play();
    //       });
    //     }
    //   );
    // });
  }, [currentUser]);

  useEffect(() => {
    peerInstance.current.on("call", async (call) => {
      console.log("inside peer.on(call)");
      // const getUserMedia =
      //   navigator.mediaDevices.getUserMedia ||
      //   navigator.mediaDevices.webkitGetUserMedia ||
      //   navigator.mediaDevices.mozGetUserMedia;
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          console.log("remoteStream answer: ", remoteStream);
          remoteUserVideoRef.current.srcObject = remoteStream;
          remoteUserVideoRef.current.play();
        });
      } catch (error) {
        console.log(error.message);
      }

      // getUserMedia(
      //   {
      //     video: true,
      //   },
      //   (mediaStream) => {
      //     console.log("inside useEffect getUserMedia");
      //     currentUserVideoRef.current.srcObject = mediaStream;
      //     currentUserVideoRef.current.play();
      //     call.answer(mediaStream);
      //     call.on("stream", (remoteStream) => {
      //       remoteUserVideoRef.current.srcObject = remoteStream;
      //       remoteUserVideoRef.current.play();
      //     });
      //   }
      // );
    });
  }, []);

  const handleCall = async (selectedFriend) => {
    if (selectedFriend) {
      const receiverRef = doc(db, "users", selectedFriend);

      // try {
      //   await updateDoc(receiverRef, {
      //     notification: {
      //       caller: props.currentUser,
      //       incomingCall: true,
      //     },
      //   });
      // } catch (error) {
      //   console.log(error.message);
      // }

      // get the peerId of the receiver from the database
      const docSnap = await getDoc(receiverRef);
      const docData = docSnap.data();
      const remotePeerId = docData.peerId;
      console.log("remotePeerId: ", remotePeerId);

      // const getUserMedia =
      //   navigator.mediaDevices.getUserMedia ||
      //   navigator.mediaDevices.webkitGetUserMedia ||
      //   navigator.mediaDevices.mozGetUserMedia;

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

      // getUserMedia(
      //   {
      //     video: true,
      //   },
      //   (mediaStream) => {
      //     console.log("inside call getUserMedia");
      //     currentUserVideoRef.current.srcObject = mediaStream;
      //     currentUserVideoRef.current.play();
      //     const call = peerInstance.current.call(remotePeerId, mediaStream);

      //     call.on("stream", (remoteStream) => {
      //       remoteUserVideoRef.current.srcObject = remoteStream;
      //       remoteUserVideoRef.current.play();
      //     });
      //   }
      // );

      // try {
      //   const mediaStream = await navigator.mediaDevices.getUserMedia({
      //     video: true,
      //     audio: true,
      //   });
      //   console.log("mediaStream: ", mediaStream);
      //   // props.localVideoRef.current.srcObject = mediaStream;
      //   // props.localVideoRef.current.play();
      //   console.log(peerInstance);
      //   const call = peerInstance.current.call(remotePeerId, mediaStream);
      //   console.log(peerInstance);

      //   // props.setLocalVideo(mediaStream);
      //   currentUserVideoRef.current.srcObject = mediaStream;
      //   currentUserVideoRef.current.play();

      //   call.on("stream", (remoteStream) => {
      //     console.log("inside call.on(stream)");
      //     // props.setRemoteVideo(remoteStream);
      //     remoteUserVideoRef.current.srcObject = remoteStream;
      //     remoteUserVideoRef.current.play();
      //   });
      // } catch (err) {
      //   console.log(err.message);
      // }

      //   getUserMedia({ video: true, audio: true }, (mediaStream) => {
      //     props.localVideoRef.current.srcObject = mediaStream;
      //     props.localVideoRef.current.play();

      //     const call = peerInstance.current.call(remotePeerId, mediaStream);
      //   });

      // view remote user's video when calling the remote user
      //   getUserMedia(
      //     { video: true, audio: true },
      //     (mediaStream) => {
      //       const call = peerInstance.current.call(remotePeerId, mediaStream);
      //       console.log("call", call);
      //       call.on("stream", (remoteStream) => {
      //         console.log("remote stream: ", remoteStream);
      //         // props.setRemoteVideo(remoteStream);
      //         props.remoteVideoRef.current.srcObject = remoteStream;
      //         props.remoteVideoRef.current.play();
      //       });
      //     },
      //     (err) => {
      //       console.log("Failed to get local stream", err);
      //     }
      //   );
    }
  };

  // useEffect(() => {
  //   if (currentUser !== "") {
  //     const docRef = doc(db, "users", currentUser);
  //     const audio = new Audio(notifysound);
  //     onSnapshot(docRef, (doc) => {
  //       const docData = doc.data();
  //       if (docData.notification.incomingCall) {
  //         // console.log("inside videoCallTracker: ", docData);
  //         setCaller(docData.notification.caller);
  //         showCallNotification();
  //         audio.play();
  //       }
  //     });
  //   }
  // }, [showCallNotification, currentUser, caller]);

  // const setLocalVideo = (mediaStream) => {
  //   console.log("inside setLocalVideo: ", currentUserVideoRef);
  //   currentUserVideoRef.current.srcObject = mediaStream;
  //   currentUserVideoRef.current.play();
  //   console.log(currentUserVideoRef);
  // };

  // const setRemoteVideo = (mediaStream) => {
  //   console.log("inside setRemoteVideo: ", remoteUserVideoRef);
  //   remoteUserVideoRef.current.srcObject = mediaStream;
  //   remoteUserVideoRef.current.play();
  //   console.log(remoteUserVideoRef);
  // };

  //   console.log("currentUserVideoRef: ", currentUserVideoRef);
  //   console.log("remoteUserVideoRef: ", remoteUserVideoRef);

  return (
    <div className={classes.main}>
      <p> My peerId is: {peerId} </p>
      <Friends user={currentUser} />
      <Chat currentUser={currentUser} call={handleCall} />
      {/* {callNotification && (
        <NotificationModal
          caller={caller}
          user={currentUser}
          setLocalVideo={setLocalVideo}
          setRemoteVideo={setRemoteVideo}
        />
      )} */}
      <div className={classes["video--call"]}>
        <div>
          currentUserVideo
          <video
            ref={currentUserVideoRef}
            autoPlay
            playsInline
            width={300}
            height={300}
            muted
          />
        </div>
        <div>
          remoteUserVideo
          <video
            ref={remoteUserVideoRef}
            autoPlay
            playsInline
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
