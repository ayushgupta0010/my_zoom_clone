import React, { useEffect, useRef, useState } from "react";

const AlwaysScrollToBottom = () => {
  let elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const Chats = ({ socketRef, roomId, msgList }) => {
  const [message, setMessage] = useState("");

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    socketRef.current.emit("create message", { roomId, message });
    setMessage("");
  };

  return (
    <div
      className='offcanvas offcanvas-end bg-dark'
      data-bs-scroll='true'
      data-bs-backdrop='true'
      tabIndex='-1'
      id='chatsOffcanvas'>
      <div className='offcanvas-header text-light'>
        <h3 className='mx-auto'>Chats</h3>
        <button
          type='button'
          className='btn-close text-reset bg-light'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
        />
      </div>

      <div className='text-center'>
        <p className='text-muted m-0'>This chat is public</p>
        <p className='text-muted m-0'>EVERYONE can see your chats</p>
      </div>

      <div className='container' style={{ height: "80%", overflowY: "auto" }}>
        {msgList.map((msg, i) => (
          <div key={i} className='text-light p-2'>
            {msg}
          </div>
        ))}
        <AlwaysScrollToBottom />
      </div>

      <div className='offcanvas-body' style={{ overflow: "hidden" }}>
        <form onSubmit={handleMessageSubmit}>
          <div className='form-floating'>
            <input
              type='text'
              className='form-control bg-dark text-light border-0'
              id='floatingInput'
              placeholder='Type a message here...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <label htmlFor='floatingInput' className='text-secondary'>
              Type a message here...
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chats;
