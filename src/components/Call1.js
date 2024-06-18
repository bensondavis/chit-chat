import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import Peer from "simple-peer";
import useConversation from "../zustand/useConversation";
import PhoneIcon from "@mui/icons-material/Phone";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";

const VoiceAndVideoCall = () => {
  const [open, setOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const myVideo = useRef();
  const myAudio = useRef();
  const userVideo = useRef();
  const userAudio = useRef();
  const connectionRef = useRef();

  const handleOpen = (video = false) => {
    setOpen(true);
    callUser(video);
  };

  const handleClose = () => {
    setOpen(false);
    //handle LeaveCall
    endCall();
  };

  useEffect(() => {
    if (open) {
      console.log("inside useEffect");
      navigator.mediaDevices
        .getUserMedia({ video: isVideo, audio: true })
        .then((stream) => {
          setStream(stream);
          if (isVideo) {
            myVideo.current.srcObject = stream;
          } else {
            myAudio.current.srcObject = stream;
          }
        });
    }

    socket.on("callUser", (data) => {
      console.log({ data });
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setIsVideo(data.isVideoCall);
      setOpen(true);
    });

    socket.on("endCall", () => {
      endCall();
    });
  }, [open]);

  const callUser = (video = false) => {
    setIsVideo(video);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      if (peer.destroyed) return;
      socket?.emit("callUser", {
        userToCall: selectedConversation,
        signalData: data,
        from: authUser.username,
        name: authUser.username,
        isVideoCall: video,
      });
    });
    peer.on("stream", (stream) => {
      if (isVideo) {
        userVideo.current.srcObject = stream;
      } else {
        userAudio.current.srcObject = stream;
      }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      if (peer.destroyed) return;
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      if (isVideo) {
        userVideo.current.srcObject = stream;
      } else {
        userAudio.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    socket.emit("endCall", { to: caller });
    setCallEnded(true);
    setCallerSignal(null);
    setCallAccepted(false);
    setReceivingCall(false);
    setIsVideo(false);
    setOpen(false);
  };
  console.log({ isVideo, caller, name });
  return (
    <>
      <div className="absolute top-2 right-2">
        <IconButton onClick={() => handleOpen(false)}>
          <CallIcon />
        </IconButton>
        <IconButton onClick={() => handleOpen(true)}>
          <VideocamIcon />
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box>
            {isVideo ? (
              <video
                ref={userVideo}
                autoPlay
                playsInline
                style={{ width: "300px" }}
              />
            ) : null}
            <audio
              ref={userAudio}
              autoPlay
              playsInline
                style={{ display: !isVideo }}
            />
            {isVideo ? (
              <video
                ref={myVideo}
                muted
                autoPlay
                playsInline
                style={{ width: "300px" }}
              />
            ) : null}
            <audio
              ref={myAudio}
              muted
              autoPlay
              playsInline
                style={{ display: !isVideo }}
            />
          </Box>
          <Box>
            {receivingCall && !callAccepted ? (
              <IconButton onClick={answerCall} color="success">
                <PhoneIcon />
              </IconButton>
            ) : null}

            <IconButton onClick={endCall} color="error">
              <PhoneIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceAndVideoCall;
