import { useRef, useEffect, useState } from "react";
import Peer from "simple-peer";
import { useSocketContext } from "../context/SocketContext";

const Call = () => {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const { socket } = useSocketContext();

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

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: me });
      axios
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        style={{ width: "300px" }}
      />
      {callAccepted && !receivingCall ? (
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
            <h1>{caller} is calling...</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : (
          <div>
            <input type="text" placeholder="ID to call" />
            <button onClick={() => callUser(id)}>Call</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Call;
