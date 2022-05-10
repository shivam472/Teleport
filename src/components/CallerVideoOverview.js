import React from "react";
import classes from "./CallerVideoOverview.module.css";
import { useEffect, useState } from "react";

const CallerVideoOverview = React.forwardRef((props, localVideoRef) => {
  console.log("inside CallerVideoOverView: ", localVideoRef);

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (localVideoRef) setShowVideo(true);
  }, []);

  return (
    <div className={classes["caller--video"]}>
      {showVideo && <video ref={localVideoRef} width={500} height={500} />}
    </div>
  );
});

export default CallerVideoOverview;
