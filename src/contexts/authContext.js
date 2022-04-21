import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const setLoginStatus = (status) => {
    console.log("login status: ", status);
    setIsLoggedIn(status);
  };

  const setCurrentUser = (email) => {
    console.log("user email: ", email);
    setUser(email);
  };

  const contextObj = {
    isLoggedIn,
    setLoginStatus,
    userEmail: user,
    setUser: setCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextObj}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
