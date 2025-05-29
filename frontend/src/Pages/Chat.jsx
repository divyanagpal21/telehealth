import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Your Socket.IO server URL

const ConsultationPage = ({ consultationId, userInfo }) => {
  const [messages, setMessages] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    // Connect socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    // Join consultation room with userInfo
    socketRef.current.emit('join-consultation', consultationId, userInfo);

    // Receive consultation history (messages + transcripts)
    socketRef.current.on('consultation-history', ({ messages, transcripts }) => {
      setMessages(messages || []);
      setTranscripts(transcripts || []);
    });

    // New chat message received
    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Transcript update received
    socketRef.current.on('transcript-update', (transcript) => {
      setTranscripts((prev) => [...prev, transcript]);
    });

    // User joined
    socketRef.current.on('user-joined', (user) => {
      setParticipants((prev) => [...prev, user]);
    });

    // User left
    socketRef.current.on('user-left', (user) => {
      setParticipants((prev) => prev.filter((p) => p.name !== user.name));
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [consultationId, userInfo]);

  // Send chat message handler
  const sendMessage = () => {
    if (chatInput.trim() === '') return;

    const messageData = {
      user: userInfo.name,
      text: chatInput.trim(),
    };

    socketRef.current.emit('message', messageData);
    setChatInput('');
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Consultation Room: {consultationId}</h2>
      <h3>Logged in as: {}</h3>

      <section style={{ marginBottom: 20 }}>
        <h4>Participants ({participants.length}):</h4>
        <ul>
          {participants.map((p) => (
            <li key={p.socketId}>{p.name}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h4>Chat Messages:</h4>
        <div style={{
          border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'auto', backgroundColor: '#f9f9f9'
        }}>
          {messages.length === 0 && <p>No messages yet.</p>}
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <b>{msg.user || 'Unknown'}:</b> {msg.text} <small style={{ color: '#888' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            style={{ width: '80%', padding: 8 }}
          />
          <button onClick={sendMessage} style={{ padding: '8px 12px', marginLeft: 8 }}>Send</button>
        </div>
      </section>

      <section>
        <h4>Transcripts:</h4>
        <div style={{
          border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'auto', backgroundColor: '#fffbe6'
        }}>
          {transcripts.length === 0 && <p>No transcripts yet.</p>}
          {transcripts.map((t, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <b>{t.speaker || 'Unknown'}:</b> {t.transcript || t.text} <small style={{ color: '#888' }}>{new Date(t.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConsultationPage;
