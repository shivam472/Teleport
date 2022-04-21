import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import classes from "./FriendList.module.css";

function FriendList(props) {
  const [friends, setFriends] = useState([]);

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

  //   useEffect(() => {
  //     const handleFriends = async () => {
  //         const docRef = doc(db, "users", props.user);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         const docData = docSnap.data();
  //         console.log("inside handleFriends ", docData);
  //         if (docData.friends) {
  //           setFriends([...docData.friends]);
  //         }
  //       } else {
  //         console.log("No such document");
  //       }
  //     };

  //     handleFriends();
  //   }, [props.user]);

  return (
    <div>
      <p className={classes.friends}>Friends</p>
      <div className={classes["friend--list"]}>
        {friends.map((friend) => (
          <div key={friend}>{friend}</div>
        ))}
      </div>
    </div>
  );
}

export default FriendList;
