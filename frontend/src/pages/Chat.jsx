import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Chat.css'; // Ensure this path is correct

const socket = io('http://localhost:5000'); // Ensure this URL matches the backend

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Receive messages from the server
  useEffect(() => {
    socket.on('receiveMessage', (receivedMessage) => {
      console.log('Message received:', receivedMessage); // Log received message for debugging
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { text: message, user: user.name }; // Include user name or ID as needed
      console.log('Sending message:', messageData); // Log message being sent
      socket.emit('sendMessage', messageData); // Send message to server
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div>
      <h2>Welcome to the Chat Room, {user?.name}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
