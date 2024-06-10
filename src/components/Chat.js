import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // useEffect(() => {
  //   socket.on('message', (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   socket.on('deleteMessage', (messageId) => {
  //     setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
  //   });

  //   return () => {
  //     socket.off('message');
  //     socket.off('deleteMessage');
  //   };
  // }, []);

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/chat/message', { content: input }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    socket.emit('sendMessage', res.data.message);
    setInput('');
  };

  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', messageId);
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>{message.content}</p>
            <button onClick={() => deleteMessage(message._id)}>Delete</button>
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;