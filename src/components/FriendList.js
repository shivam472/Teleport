import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/authContext";
import classes from "./FriendList.module.css";

function FriendList(props) {
  const [friends, setFriends] = useState([]);
  const { setFriend: setSelectedFriend } = useContext(AuthContext);

  useEffect(() => {
    const handleFriendsUpdates = () => {
      try {
        const docRef = doc(db, "users", props.user);
        onSnapshot(docRef, (doc) => {
          const docData = doc.data();
          console.log(docData);
          setFriends([...docData.friends]);
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    handleFriendsUpdates();
  }, [props.user]);

  return (
    <>
      <p className={classes["friends--text"]}>Friends</p>
      <ul className={classes["friend--list"]}>
        {friends.map((friend) => (
          <li
            key={friend}
            className={classes["friend--email"]}
            onClick={() => {
              setSelectedFriend(friend);
            }}
          >
            {friend}
          </li>
        ))}
      </ul>
    </>
  );
}

export default FriendList;
