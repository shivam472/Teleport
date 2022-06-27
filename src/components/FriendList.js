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
        if (props.user) {
          const docRef = doc(db, "users", props.user);
          onSnapshot(docRef, (doc) => {
            const docData = doc.data();
            // console.log(docData);
            setFriends([...docData.friends]);
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    handleFriendsUpdates();
  }, [props.user]);

  return (
    <>
      <div className={classes["friends-text--container"]}>
        <p className={classes["friends--text"]}>Friends</p>
      </div>
      <ul className={classes["friend--list"]}>
        {friends.map((friend) => (
          <div className={classes['email--container']} key={friend}>
            <li
              className={classes["friend--email"]}
              onClick={() => {
                setSelectedFriend(friend);
              }}
            >
              {friend}
            </li>
            <div className={classes.margin}></div>
          </div>
        ))}
      </ul>
    </>
  );
}

export default FriendList;
