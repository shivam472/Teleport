import React from "react";
import classes from "./ReceiverVideoOverview.module.css";
import { useEffect, useState } from "react";

const ReceiverVideoOverview = React.forwardRef((props, remoteVideoRef) => {
  console.log("inside ReceiverVideoOverView: ", remoteVideoRef);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (remoteVideoRef) setShowVideo(true);
  }, [remoteVideoRef]);

  return (
    <div className={classes["receiver--video"]}>
      {showVideo && <video ref={remoteVideoRef} width={500} height={500} />}
    </div>
  );
});

export default ReceiverVideoOverview;
