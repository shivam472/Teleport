import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [callNotification, setCallNotification] = useState(false);

  const setLoginStatus = (status) => {
    console.log("inside authCtx, login status: ", status);
    setIsLoggedIn(status);
  };

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
    isLoggedIn,
    selectedFriend,
    callNotification,
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
