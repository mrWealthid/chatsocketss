import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:7000');
function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState('');
  const [sock, setSock] = useState('');

  const [feedback, setFeedback] = useState('');

  //confirming socket connection from server
  useEffect(() => {
    socket.on('connect', () => {
      setSock(socket.id);
      console.log('Message recieved on server :', socket.id);
    });
  }, []);

  //Reading message event from server
  useEffect(() => {
    socket.on('message', (payload) => {
      setChat([...chat, payload]);
      console.log('Message recieved on server :', payload);
    });
  });

  //Reading typing event from server
  useEffect(() => {
    socket.on('typing', (payload) => {
      console.log(payload);
      setFeedback(`${payload} is typing`);
    });
  });

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    //send message on sockets

    socket.emit('message', { name: user, message: message });

    //clear fields

    setMessage('');
    setFeedback('');
  };

  const handleKeyPress = () => {
    socket.emit('typing', user);
  };

  //using emit and broadcast
  //broadcast sends to all except sender
  //emit sends to all including sender

  return (
    <div className='App'>
      <div className='mario-chat'>
        <h2>Wealth Chat</h2>
        <p>{sock}</p>

        <p>{feedback}</p>
        <div className='chat-window'>
          <div className='output'>
            {chat.map((msg) => (
              <>
                <h4>{msg.name}</h4>
                <p>{msg.message}</p>
              </>
            ))}
          </div>
        </div>
        <input
          className='handle'
          type='text'
          placeholder='Handle'
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className='message'
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Message'
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} className='send'>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
