import classes from "./Friends.module.css";
import { FiSearch } from "react-icons/fi";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FriendList from "./FriendList";

function Friends(props) {
  const [inputEmail, setInputEmail] = useState("");
  const [searchedFriend, setSearchedFriend] = useState("");

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
      const docRef = doc(db, "users", props.user);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      const searchedFriendDocRef = doc(db, "users", searchedFriend);
      const searchedFriendDocSnap = await getDoc(searchedFriendDocRef);
      const searchedFriendDocData = searchedFriendDocSnap.data();

      // add a friend into the current user's friend list
      await updateDoc(docRef, {
        friends: [...docData.friends, searchedFriend],
      });

      // add the current user as a friend into the searched user's friend's list
      await updateDoc(searchedFriendDocRef, {
        friends: [...searchedFriendDocData.friends, props.user],
      });

      setSearchedFriend("");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className={classes["friends--section"]}>
      <h3 className={classes.user}>{props.user}</h3>
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
      <div className={classes["friend--list"]}>
        <FriendList user={props.user} />
      </div>
    </section>
  );
}

export default Friends;
