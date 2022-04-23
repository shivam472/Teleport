import classes from "./MainComponent.module.css";
import Friends from "./Friends";
import { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import AuthContext from "../contexts/authContext";
import { doc, onSnapshot } from "firebase/firestore";
import Chat from "./Chat";
import NotificationModal from "./NotificationModal";
import notifysound from "../assets/notifysound.mp3";

function MainComponent() {
  const [currentUser, setCurrentUser] = useState("");
  const [caller, setCaller] = useState("");
  const { showCallNotification, callNotification } = useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser.email);
    });
  }, []);

  useEffect(() => {
    if (currentUser !== "") {
      const docRef = doc(db, "users", currentUser);
      const audio = new Audio(notifysound);
      onSnapshot(docRef, (doc) => {
        const docData = doc.data();
        if (docData.notification.incomingCall) {
          console.log("inside videoCallTracker: ", docData);
          showCallNotification();
          setCaller(docData.notification.caller);
          audio.play();
        }
      });
    }
  }, [showCallNotification, currentUser, caller]);

  return (
    <div className={classes.main}>
      <Friends user={currentUser} />
      <Chat user={currentUser} />
      {callNotification && (
        <NotificationModal caller={caller} user={currentUser} />
      )}
    </div>
  );
}

export default MainComponent;
