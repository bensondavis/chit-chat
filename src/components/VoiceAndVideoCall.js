import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useSocketContext } from "../context/SocketContext";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import useCall from "../zustand/useCall";

const VoiceAndVideoCall = () => {
  //   const [open, setOpen] = useState(false);
  const {
    name,
    callAccepted,
    receivingCall,
    myVideo,
    userVideo,
    isVideoCall,
    callEnded,
    callUser,
    leaveCall,
    setIsVideoCall,
    getMediaDevices,
    answerCall,
  } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { stream, setStream, open, setOpen } = useCall();

  useEffect(() => {
    if (open) {
      //navigator
      //   getMediaDevices();
      navigator.mediaDevices
        .getUserMedia({ video: isVideoCall, audio: true })
        .then((stream) => {
          setStream(stream);
          myVideo.current.srcObject = stream;
        });
    }
  }, [open, isVideoCall]);

  useEffect(() => {
    if (receivingCall) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [receivingCall]);

  useEffect(() => {
    if (open && stream && selectedConversation) {
      callUser(selectedConversation, isVideoCall);
    }
  }, [stream]);

  const startCall = (video) => {
    setIsVideoCall(video);
    setOpen(true);
  };

  return (
    <>
      <div className="absolute top-2 right-2 z-10">
        <IconButton onClick={() => startCall(false)}>
          <CallIcon />
        </IconButton>

        <IconButton onClick={() => startCall(true)}>
          <VideocamIcon />
        </IconButton>
      </div>
      <Dialog open={open}>
        <DialogTitle>
          {receivingCall
            ? `${name} is calling...`
            : `Calling ${selectedConversation}`}
        </DialogTitle>
        <DialogContent>
          <Stack direction={"column"}>
            {callAccepted ? (
              <>
                <video
                  playsInline
                  autoPlay
                  ref={userVideo}
                  style={{
                    width: "400px",
                    height: `${!isVideoCall ? "0px" : "300px"}`,
                  }}
                />
                <p>user video</p>
              </>
            ) : null}

            <video
              playsInline
              autoPlay
              muted
              ref={myVideo}
              style={{
                width: "400px",
                height: `${!isVideoCall ? "0px" : "300px"}`,
              }}
            />
            <p>my video</p>
          </Stack>
        </DialogContent>

        <DialogActions>
          {!callAccepted && receivingCall ? (
            <Button onClick={answerCall}>answerCall</Button>
          ) : null}

          <Button onClick={leaveCall}>End Call</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceAndVideoCall;
