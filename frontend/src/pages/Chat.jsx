import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Chat.css'; // Import the styles

// Initialize socket connection to backend
const socket = io('http://localhost:5000');

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Receive messages from the server
  useEffect(() => {
    socket.on('receiveMessage', (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { text: message, user: user.name }; // Include user name or ID as needed
      socket.emit('sendMessage', messageData); // Send message to server
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div>
      <h2>Welcome to the Chat Room, {user?.name}</h2>
      <div>
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
    </div>
  );
};

export default Chat;
