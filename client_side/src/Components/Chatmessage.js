import React from 'react';
import useFetch from '../hooks/Fetch.hook.js';
const Chatmessage = ({ text, logo, email,username }) => {
  const [{ apiData }] = useFetch();
  // Check if user exists and has an email property
  const isCurrentUser = apiData && apiData.email === email;

  return (
    <div className={`d-flex ${isCurrentUser ? 'justify-content-end' : ''}`}>
      <div className={isCurrentUser ? 'message-right' : 'message-left'}>
        <span className='message-text'>{text}</span>
        
        <img src={logo} alt="logo" className='logo-icon' /><br/>
        <span className='message-firstname'>{username}</span>
      </div>
    </div>
  );
};

export default Chatmessage;