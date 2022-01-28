import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Chats from "./Chats";
import Participants from "./Participants";
import Controls from "./Controls";

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video id='student-video' className='m-1' autoPlay ref={ref} />;
};

const Room = () => {
  const [peers, setPeers] = useState([]);
  const [msgList, setMsgList] = useState([]);

  const userVideo = useRef();
  const socketRef = useRef();
  const peersRef = useRef([]);

  const roomId = "my-room";

  const configureStream = (stream) => {
    userVideo.current.srcObject = stream;
    stream.getAudioTracks()[0].enabled = false;
    stream.getVideoTracks()[0].enabled = false;
  };

  const createPeer = (roomToSignal, callerId, stream) => {
    let peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        roomToSignal,
        callerId,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    let peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000/");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        configureStream(stream);

        socketRef.current.emit("join room", roomId);

        socketRef.current.on("new user", (peerId) => {
          let peer = createPeer(roomId, socketRef.current.id, stream);
          peersRef.current.push({ peerId, peer });
          setPeers((original) => [...original, { peer, peerId }]);
        });

        socketRef.current.on("user joined", (payload) => {
          let peer = addPeer(payload.signal, payload.callerId, stream);
          peersRef.current.push({
            peerId: payload.callerId,
            peer,
          });
          setPeers((users) => [...users, { peer, peerId: payload.callerId }]);
        });
      });

    socketRef.current.on("receiving returned signal", (payload) => {
      let item = peersRef.current.find((p) => p.peerId === payload.id);
      item.peer.signal(payload.signal);
    });

    socketRef.current.on("user disconnected", (userId) => {
      peersRef.current = peersRef.current.filter((p) => p.peerId !== userId);
      setPeers((peers) => peers.filter((p) => p.peerId !== userId));
    });

    socketRef.current.on("new message", (payload) => {
      setMsgList((original) => [...original, payload.message]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <>
      <div className='container-fluid' style={{ height: "100vh" }}>
        <div className='d-flex justify-content-center mb-5'>
          <video id='teacher-video' ref={userVideo} autoPlay />
        </div>

        <div className='container-fluid'>
          {peers.map((p, i) => (
            <Video key={i} peer={p.peer} />
          ))}
        </div>
      </div>

      <Participants peers={peers} />
      <Chats socketRef={socketRef} roomId={roomId} msgList={msgList} />
      <Controls userVideo={userVideo} />
    </>
  );
};

export default Room;
