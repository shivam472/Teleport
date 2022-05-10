import { createContext, useRef, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [callNotification, setCallNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const peerInstance = useRef(null);

  const setFriend = (selectedEmail) => {
    setSelectedFriend(selectedEmail);
    console.log("inside authCtx, current selected friend: ", selectedEmail);
  };

  const showCallNotification = () => {
    setCallNotification(true);
    console.log("inside showCallNotification");
  };

  const hideCallNotification = () => {
    setCallNotification(false);
    console.log("inside hideCallNotification");
  };

  const contextObj = {
    loginStatus,
    selectedFriend,
    callNotification,
    peerInstance,
    setLoginStatus,
    setFriend,
    showCallNotification,
    hideCallNotification,
  };

  return (
    <AuthContext.Provider value={contextObj}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
