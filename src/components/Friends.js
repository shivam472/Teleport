import classes from "./Friends.module.css";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";

function Friends() {
  const [friends, setFriends] = useState([]);

  return (
    <section className={classes["friends--section"]}>
      <div className={classes.search}>
        <input
          type={"search"}
          className={classes["friends--search"]}
          placeholder="Search People By Email"
          autoComplete="off"
        />
        <FiSearch className={classes["search--icon"]} />
      </div>
    </section>
  );
}

export default Friends;
