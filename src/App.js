import "./App.css";
import Authentication from "./pages/Authentication";
import Main from "./pages/Main";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./contexts/authContext";
import { useContext } from "react";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route exact path="/" element={<Authentication />} />
      </Routes>
    </div>
  );
}

export default App;
