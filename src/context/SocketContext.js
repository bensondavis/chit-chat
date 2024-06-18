import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [isVideoCall, setIsVideoCall] = useState(false);
  const { authUser } = useAuthContext();

  const myVideo = useRef();
  const myAudio = useRef();
  const userVideo = useRef();
  const userAudio = useRef();
  const connectionRef = useRef();
  console.log({name, call, isVideoCall, callAccepted})
  useEffect(() => {
    if (authUser) {
      const skt = io(process.env.REACT_APP_SERVER_URI);

      setSocket(skt);

      skt.emit("registerSocket", authUser.username);

      skt.on("callUser", ({ from, name, signal, isVideoCall }) => {
        setCall({ isReceivingCall: true, from, name, signal, isVideoCall });
        setIsVideoCall(isVideoCall);
        setName(name);
        console.log("useEffect callUser",{ call, isVideoCall });
      });
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      // if (call.isVideoCall) {
        userVideo.current.srcObject = currentStream;
      // } else {
      //   userAudio.current.srcObject = currentStream;
      // }
    });
  
    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id, video) => {
    setIsVideoCall(video);
    console.log("CallUser Event", { video, isVideoCall });
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: authUser.username,
        name: authUser.username,
        isVideoCall: video,
      });
    });

    peer.on("stream", (currentStream) => {
      // if (video) {
        userVideo.current.srcObject = currentStream;
      // } else {
      //   userAudio.current.srcObject = currentStream;
      // }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        call,
        callAccepted,
        myVideo,
        myAudio,
        userVideo,
        userAudio,
        stream,
        name,
        callEnded,
        isVideoCall,
        setStream,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
