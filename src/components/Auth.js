import classes from "./Auth.module.css";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const { setLoginStatus, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
    });
  }, []);

  const createUser = async (user) => {
    // console.log(user);
    try {
      const usersRef = doc(db, "users", user.email);
      await setDoc(
        usersRef,
        { email: user.email, friends: [] },
        { merge: true }
      );
      setLoginStatus(true);
      setUser(currentUser.email);
    } catch (error) {
      console.log(error.messagge);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;
      createUser(user);
      navigate("/main");
      console.log(user);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      createUser(userCred.user);
      navigate("/main");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginStatus(true);
      setUser(currentUser.email);
      navigate("/main");
      setEmail("");
      setPassword("");
      //   console.log(userCred.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes["auth--container"]}>
      <form
        className={classes.auth}
        onSubmit={isLoginClicked ? handleEmailSignIn : handleEmailSignup}
      >
        <Button variant="contained" onClick={handleGoogleSignIn}>
          <FcGoogle className={classes["google-icon"]} />
          sign in with google
        </Button>

        {isLoginClicked ? (
          <p className={classes["signup--text"]}>SIGN IN WITH EMAIL</p>
        ) : (
          <p className={classes["signup--text"]}>OR SIGN UP WITH EMAIL</p>
        )}

        <div className={classes["email--label"]}>
          <label htmlFor="email">Email</label>
        </div>
        <input
          type={"email"}
          value={email}
          id="email"
          autoComplete="off"
          className={classes["email--input"]}
          placeholder="your@email.com"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <div className={classes["password--label"]}>
          <label htmlFor="password">Password</label>
        </div>
        <input
          type={"password"}
          value={password}
          id="password"
          placeholder="Password"
          className={classes["password--input"]}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        {isLoginClicked ? (
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#E65B7C" }}
          >
            login
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#E65B7C" }}
          >
            get started
          </Button>
        )}

        {isLoginClicked ? (
          <div>
            <p>Don't have an account?</p>
            <Button
              variant="text"
              onClick={() => {
                setIsLoginClicked(false);
              }}
              style={{ letterSpacing: "1px" }}
            >
              sign up with email
            </Button>
          </div>
        ) : (
          <div className={classes["login--text"]}>
            <p>Already have an account? </p>
            <Button
              variant="text"
              onClick={() => {
                setIsLoginClicked(true);
              }}
            >
              log in
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Auth;
