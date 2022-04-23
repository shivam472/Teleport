import classes from "./NotificationModal.module.css";
import Button from "@mui/material/Button";
import AuthContext from "../contexts/authContext";
import { useContext } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

function NotificationModal(props) {
  const { hideCallNotification } = useContext(AuthContext);

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

  const handleAccept = () => {};

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
