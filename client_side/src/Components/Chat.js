import React, { useEffect, useState, useRef } from 'react';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Config/firebase.js';
import useFetch from '../hooks/Fetch.hook.js';
import profile from '../assets/profile.png';
import Chatmessage from '../Components/Chatmessage';
import toast,{Toaster} from 'react-hot-toast';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messageRef = collection(db, 'messages');
  const [{ apiData }] = useFetch();
  const chatContainerRef = useRef(null);
  const isUserScrollingRef = useRef(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      // If the text is empty or only contains whitespace, show a toast notification and reject the submission
      toast.error('Message cannot be empty');
      return;
    }

    const date = new Date();

    try {
      await addDoc(messageRef, {
        text,
        username: apiData?.username || '',
        email: apiData?.email,
        logo: apiData?.profile || profile,
        date,
      });

      setText('');
      scrollToBottom();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    const handleScroll = () => {
      const isUserNearBottom =
        chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10;

      isUserScrollingRef.current = !isUserNearBottom;
    };

    chatContainer.addEventListener('scroll', handleScroll);

    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, [chatContainerRef]);

  useEffect(() => {
    const unsubscribe = onSnapshot(messageRef, (quertsnapahot) => {
      const newMessages = quertsnapahot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.date - b.date);
      setMessages(newMessages);

      if (!isUserScrollingRef.current) {
        scrollToBottom(); 
      }
    });

    return () => unsubscribe();
  }, [messageRef]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div>
       <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className='text-center'>{/* Add any content for the text-center div if needed */}</div>
      <div className='row mt-4 justify-content-center'>
        <div className='col-xl-10 col-lg-10 col-sm-6 col-8 chat-message' ref={chatContainerRef}>
          {messages.map((message, index) => (
            <Chatmessage key={index} {...message} />
          ))}
          <div className='d-flex mt-2'>
            <input
              type='text'
              className='form-control'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className='btn btn-secondary ms-3' onClick={handleSubmit}>
              Send
            </button>
          </div>
          <div id='copyright' className='mt-3'>
            welcome to aroha Technologies
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;