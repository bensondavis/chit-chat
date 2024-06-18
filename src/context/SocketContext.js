import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import Peer from "simple-peer";
import useConversation from "../zustand/useConversation";
import useCall from "../zustand/useCall";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  // const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  // const [callerSignal, setCallerSignal] = useState();
  const [name, setName] = useState("");
  // const [isVideoCall, setIsVideoCall] = useState(false);
  const { authUser } = useAuthContext();
  const {
    isVideoCall,
    setIsVideoCall,
    stream,
    setStream,
    callerSignal,
    setCallerSignal,
    setOpen
  } = useCall();

  const myVideo = useRef();
  const myAudio = useRef();
  const userVideo = useRef();
  const userAudio = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (authUser) {
      const skt = io(process.env.REACT_APP_SERVER_URI);

      setSocket(skt);

      skt.emit("registerSocket", authUser.username);

      skt.on("callUser", (data) => {
        // setOpen(true);
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
        setIsVideoCall(data.isVideoCall);
      });

      skt.on("endCall", () => {
        setReceivingCall(false);
        setCaller();
        setName("");
        setCallerSignal(null);
        setIsVideoCall(false);
        setOpen(false);
      });
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  const callUser = (id, video) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: authUser.username,
        name: authUser.username,
        isVideoCall: video,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.on("error", () => {
      peer.destroy();
    });

    socket?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer?.signal(signal);
    });

    peer.on('close', () => {
      leaveCall();
    })

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

    peer.on('close', () => {
      leaveCall();
    })

    peer.on("error", () => {
      peer.destroy();
      leaveCall();
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    socket.emit("endCall", { to: caller });
    setOpen(false);
    if (connectionRef.current) connectionRef.current.destroy();
    else connectionRef = null;
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        callAccepted,
        myVideo,
        userVideo,
        name,
        callEnded,
        isVideoCall,
        receivingCall,
        // setStream,
        callUser,
        answerCall,
        leaveCall,
        setIsVideoCall,
        // getMediaDevices,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};