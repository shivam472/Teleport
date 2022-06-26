import "./App.css";
import Authentication from "./pages/Authentication";
import Main from "./pages/Main";
import Error from "./pages/Error";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setIsLoggedIn(true);
      else console.log("user is signed out");
    });
  }, []);

  // console.log("isLoggedIn: ", isLoggedIn);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Authentication />} />
        {isLoggedIn && <Route path="/main" element={<Main />} />}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
