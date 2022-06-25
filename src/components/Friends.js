import classes from "./Friends.module.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import { useState, useContext } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import FriendList from "./FriendList";
import AuthContext from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

function Friends(props) {
  const [inputEmail, setInputEmail] = useState("");
  const [searchedFriend, setSearchedFriend] = useState("");
  const { setLoginStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFriendSearch = async (inputEmail) => {
    if (inputEmail !== props.user) {
      const docRef = doc(db, "users", inputEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        try {
          const currentUserDocRef = doc(db, "users", props.user);
          const currentDocSnap = await getDoc(currentUserDocRef);
          const currentDocData = currentDocSnap.data();
          if (!currentDocData.friends.includes(inputEmail)) {
            console.log("Document data: ", docSnap.data());
            const docData = docSnap.data();
            setSearchedFriend(docData.email);
          }
          setInputEmail("");
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No such document!");
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      // both the parties will be added to each other's friend lists
      const currentUserDocRef = doc(db, "users", props.user);
      const currentUserDocSnap = await getDoc(currentUserDocRef);
      const currentUserDocData = currentUserDocSnap.data();

      const searchedFriendDocRef = doc(db, "users", searchedFriend);
      const searchedFriendDocSnap = await getDoc(searchedFriendDocRef);
      const searchedFriendDocData = searchedFriendDocSnap.data();

      // add a friend into the current user's friend list
      await updateDoc(currentUserDocRef, {
        friends: [...currentUserDocData.friends, searchedFriend],
      });

      // add the current user into the searched user's friend list
      await updateDoc(searchedFriendDocRef, {
        friends: [...searchedFriendDocData.friends, props.user],
      });

      setSearchedFriend("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user signed out");
        setLoginStatus(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <section className={classes["friends--section"]}>
      <h3 className={classes.user}>{props.user}</h3>
      <div className={classes.search}>
        <TextField
          style={{
            border: "none",
            backgroundColor: "white",
            outline: "none",
            borderRadius: "5px",
            padding: "5px 20px",
          }}
          variant="standard"
          value={inputEmail}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  onClick={() => handleFriendSearch(inputEmail)}
                  style={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          placeholder="Search People By Email"
          onChange={(e) => setInputEmail(e.target.value)}
        />
      </div>
      {searchedFriend && (
        <div className={classes["searched--friend"]}>
          {searchedFriend}
          <PersonAddIcon
            style={{
              color: "#6285FF",
              cursor: "pointer",
              marginLeft: "30px",
            }}
            onClick={handleAddFriend}
          />
        </div>
      )}
      <div className={classes["friend--list"]}>
        <FriendList user={props.user} />
      </div>

      <div className={classes["signout--button"]}>
        <Button variant="contained" onClick={handleSignOut}>
          sign out
        </Button>
      </div>
    </section>
  );
}

export default Friends;
