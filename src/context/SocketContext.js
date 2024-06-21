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
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [name, setName] = useState("");
  const { authUser } = useAuthContext();
  const { addContact } = useConversation();
  const {
    isVideoCall,
    setIsVideoCall,
    stream,
    setStream,
    callerSignal,
    setCallerSignal,
    setOpen,
  } = useCall();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (authUser) {
      const skt = io(process.env.REACT_APP_SERVER_URI);

      setSocket(skt);

      skt.emit("registerSocket", authUser.username);

      skt.on("callUser", (data) => {
        console.log({ data });
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

      skt.on("newContact", (data) => {
        addContact(data);
      });
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  const callUser = (id, video) => {
    console.log("call USer", { stream });
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
          {
            url: "turn:turn.bistri.com:80",
            credential: "homeo",
            username: "homeo",
          },
          {
            url: "turn:turn.anyfirewall.com:443?transport=tcp",
            credential: "webrtc",
            username: "webrtc",
          },
        ],
      },
    });
    peer.on("signal", (data) => {
      console.log("call user on signal", { data });
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: authUser.username,
        name: authUser.username,
        isVideoCall: video,
      });
    });

    peer.on("stream", (stream) => {
      console.log("on stream", { stream });
      userVideo.current.srcObject = stream;
    });

    peer.on("error", () => {
      peer.destroy();
    });

    socket?.on("callAccepted", (signal) => {
      console.log("on call accepted", { signal });
      setCallAccepted(true);
      peer?.signal(signal);
    });

    peer.on("close", () => {
      leaveCall();
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    console.log("answecall", { stream });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer?.on("signal", (data) => {
      console.log("answer call signal", { data, caller });
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer?.on("stream", (stream) => {
      console.log("answer call stream", { stream });
      userVideo.current.srcObject = stream;
    });

    peer.on("close", () => {
      // leaveCall();
    });

    peer.on("error", (err) => {
      console.log({ err });
      peer.destroy();
      // leaveCall();
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    socket.emit("endCall", { to: caller });
    setOpen(false);
    if (connectionRef.current) connectionRef.current.destroy();
    else connectionRef = null;
    // window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        callAccepted,
        myVideo,
        userVideo,
        name,
        isVideoCall,
        receivingCall,
        callUser,
        answerCall,
        leaveCall,
        setIsVideoCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
