import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import Peer from "simple-peer";
import useConversation from "../zustand/useConversation";
import PhoneIcon from "@mui/icons-material/Phone";
import { useAuthContext } from "../context/AuthContext";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";

const Call = () => {
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
  const userVideo = useRef();
  const connectionRef = useRef();


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket?.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: selectedConversation,
        signalData: data,
        from: authUser.username,
        name: authUser.username,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer?.signal(signal);
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
    peer?.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer?.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer?.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef?.current.destroy();
  };

  return (
    <Box>
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        style={{ width: "300px" }}
      />
      {callAccepted && !callEnded ? (
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      ) : null}
      <div>
        {receivingCall && !callAccepted ? (
          <div>
            <h1>{name} is calling...</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : (
          <div>
            <button onClick={() => callUser()}>Call</button>
          </div>
        )}

        {callAccepted && !callEnded ? (
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            End Call
          </Button>
        ) : (
          <IconButton color="primary" aria-label="call" onClick={callUser}>
            <PhoneIcon fontSize="large" />
          </IconButton>
        )}
      </div>
    </Box>
  );
};

export default Call;
