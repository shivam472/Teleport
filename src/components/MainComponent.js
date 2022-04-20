import classes from "./MainComponent.module.css";
import Friends from "./Friends";

function MainComponent() {
  return (
    <div className={classes.main}>
      <Friends />
    </div>
  );
}

export default MainComponent;
