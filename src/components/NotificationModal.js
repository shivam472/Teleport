import classes from "./NotificationModal.module.css";
import Button from "@mui/material/Button";
import AuthContext from "../contexts/authContext";
import { useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function NotificationModal(props) {
  const { hideCallNotification, selectedFriend } = useContext(AuthContext);
  const [caller, setCaller] = useState("");

  useEffect(() => {
    const getCaller = async () => {
      try {
        const docRef = doc(db, "users", props.currentUser);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
        setCaller(docData.notification.caller);
      } catch (error) {
        console.error(error.message);
      }
    };

    getCaller();
  }, []);

  const handleAccept = () => {
    props.setCallStatus(true);
    hideCallNotification();
  };

  const handleDecline = async () => {
    hideCallNotification();

    const currentUserRef = doc(db, "users", props.currentUser);
    const remoteUserRef = doc(db, "users", selectedFriend);

    try {
      await updateDoc(currentUserRef, {
        call: "call-declined",
      });
      await updateDoc(remoteUserRef, {
        call: "call-declined",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={classes["modal--overlay"]}>
      <div className={classes["modal--container"]}>
        <div className={classes.title}>
          <h2>Incoming video call from {caller} </h2>
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
