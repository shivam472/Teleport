import classes from "./Friends.module.css";
import { FiSearch } from "react-icons/fi";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import FriendList from "./FriendList";

function Friends() {
  const [inputEmail, setInputEmail] = useState("");
  const [searchedFriend, setSearchedFriend] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser.email);
    });
  });

  const handleFriendSearch = async (inputEmail) => {
    if (inputEmail !== currentUser) {
      const docRef = doc(db, "users", inputEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentUserDocRef = doc(db, "users", currentUser);
        const currentDocSnap = await getDoc(currentUserDocRef);
        const currentDocData = currentDocSnap.data();
        if (!currentDocData.friends.includes(inputEmail)) {
          console.log("Document data: ", docSnap.data());
          const docData = docSnap.data();
          setSearchedFriend(docData.email);
        }
        setInputEmail("");
      } else {
        console.log("No such document!");
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      const docRef = doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      const newFriend = {
        ...docData,
        friends: [...docData.friends, searchedFriend],
      };
      await updateDoc(docRef, newFriend);
      setSearchedFriend("");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className={classes["friends--section"]}>
      <h3 className={classes.user}>{currentUser}</h3>
      <div className={classes.search}>
        <input
          type={"search"}
          value={inputEmail}
          className={classes["friends--search"]}
          placeholder="Search People By Email"
          autoComplete="off"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <FiSearch
          className={classes["search--icon"]}
          onClick={() => {
            handleFriendSearch(inputEmail);
          }}
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
      <FriendList user={currentUser} />
    </section>
  );
}

export default Friends;
