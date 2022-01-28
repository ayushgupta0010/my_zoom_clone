import React, { useState } from "react";

const Controls = ({ userVideo }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const muteUnmute = () => {
    let enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
      setAudioEnabled(false);
    } else {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
      setAudioEnabled(true);
    }
  };

  const playStop = () => {
    let enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      setVideoEnabled(false);
    } else {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
      setVideoEnabled(true);
    }
  };

  return (
    <nav className='navbar fixed-bottom navbar-dark bg-dark'>
      <div className='container'>
        <button className='btn btn-sm text-light' onClick={muteUnmute}>
          {audioEnabled ? (
            <i className='bi bi-mic-mute-fill text-danger' />
          ) : (
            <i className='bi bi-mic-fill text-primary' />
          )}
          {audioEnabled ? (
            <p className='text-danger m-0'>Mute</p>
          ) : (
            <p className='text-primary m-0'>Unmute</p>
          )}
        </button>

        <button className='btn btn-sm text-light' onClick={playStop}>
          {videoEnabled ? (
            <i className='bi bi-camera-video-off-fill text-danger' />
          ) : (
            <i className='bi bi-camera-video-fill text-primary' />
          )}
          {videoEnabled ? (
            <p className='text-danger m-0'>Hide</p>
          ) : (
            <p className='text-primary m-0'>Show</p>
          )}
        </button>

        <button
          className='btn btn-sm'
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#participantsOffcanvas'
          aria-controls='participantsOffcanvas'>
          <i className='bi bi-people-fill text-primary' />
          <p className='text-primary m-0'>Participants</p>
        </button>

        <button
          className='btn btn-sm'
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#chatsOffcanvas'
          aria-controls='chatsOffcanvas'>
          <i className='bi bi-chat-text-fill text-primary' />
          <p className='text-primary m-0'>Chat</p>
        </button>
      </div>
    </nav>
  );
};

export default Controls;
