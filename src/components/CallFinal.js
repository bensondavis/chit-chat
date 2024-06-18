import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useSocketContext } from "../context/SocketContext";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";

const CallFinal = () => {
  const [open, setOpen] = useState(false);
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    myAudio,
    isVideoCall,
    userAudio,
    callEnded,
    stream,
    setStream,
    call,
    leaveCall,
    callUser,
    answerCall,
  } = useSocketContext();
  const { selectedConversation } = useConversation();

  useEffect(() => {
    if (open) {
      navigator.mediaDevices
        .getUserMedia({ video: isVideoCall, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
        //   if (isVideoCall) {
        if(myVideo.current)
             myVideo.current.srcObject = currentStream;
        //   } else {
        //      myAudio.current.srcObject = currentStream;
        //   }
        });
    }
  }, [open, isVideoCall]);

  useEffect(() => {
    if (call) {
      setOpen(call.isReceivingCall);
    }
  }, [call]);

  const handleOpen = (video) => {
    setOpen(true);
    callUser(selectedConversation, video);
  };

  console.log({ stream, isVideoCall });

  return (
    <>
      <div className="absolute top-2 right-2 z-10">
        <IconButton onClick={() => handleOpen(false)}>
          <CallIcon />
        </IconButton>

        <IconButton onClick={() => handleOpen(true)}>
          <VideocamIcon />
        </IconButton>
      </div>
      <Dialog open={open}>
        <DialogTitle>
          {call?.isReceivingCall
            ? `${name} is calling...`
            : `Calling ${selectedConversation}`}
        </DialogTitle>
        <Box>
          <Stack direction={"column"}>
            {callAccepted && !callEnded ? (
            //   call.isVideoCall ? (
                <>
                  <video
                    playsInline
                    autoPlay
                    ref={userVideo}
                    style={{ width: "400px" }}
                  />
                  <p>user video</p>
                </>
            //   ) : (
            //     <audio playsInline autoPlay ref={userAudio} />
            //   )
            ) : null}
                  <video
                    playsInline
                    autoPlay
                    muted
                    ref={myVideo}
                    style={{ width: "400px" }}
                  />
                  <p>my video</p>
          </Stack>
          {call?.isReceivingCall && !callAccepted ? (
            <Button onClick={answerCall}>answerCall</Button>
          ) : null}

          <Button onClick={leaveCall}>End Call</Button>
        </Box>
      </Dialog>
    </>
  );
};

export default CallFinal;
