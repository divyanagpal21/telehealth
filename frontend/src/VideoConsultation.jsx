import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Send,
  MessageCircle,
  Volume2
} from 'lucide-react';
import io from 'socket.io-client';

const VideoConsultation = () => {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isConnected, setIsConnected] = useState(false);
  const [participants] = useState([
    {
      id: 'dr-emma',
      name: 'Dr. Emma Johnson',
      role: 'Healthcare Provider',
      avatar: 'EJ',
      color: 'bg-pink-500'
    },
    {
      id: 'patient-john',
      name: 'John Smith',
      role: 'Patient',
      avatar: 'JS',
      color: 'bg-purple-400'
    }
  ]);
  
  // Refs
  const wsRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize connections
  useEffect(() => {
    // Initialize Socket.IO for chat
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('transcript-update', (transcriptData) => {
      setTranscript(prev => prev + ' ' + transcriptData.text);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // WebSocket for Deepgram transcription
  const connectDeepgramWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    wsRef.current = new WebSocket('ws://localhost:5000');
    
    wsRef.current.onopen = () => {
      console.log('Connected to Deepgram WebSocket');
    };
    
    wsRef.current.onmessage = (event) => {
      const newTranscript = event.data;
      if (newTranscript.trim()) {
        const transcriptData = {
          text: newTranscript,
          timestamp: new Date().toISOString(),
          speaker: 'current-user'
        };
        
        // Send to Socket.IO for real-time sharing
        socketRef.current?.emit('transcript', transcriptData);
        setTranscript(prev => prev + ' ' + newTranscript);
      }
    };
    
    wsRef.current.onclose = () => {
      console.log('Disconnected from Deepgram WebSocket');
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      connectDeepgramWebSocket();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'current-user',
        senderName: 'You',
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.emit('message', message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              5/22/2025 • 10:00 AM (30 min)
            </h1>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
            <PhoneOff className="h-4 w-4" />
            <span>End Consultation</span>
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Video className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Video stream would appear here</p>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-2 mx-auto"></div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-80 px-6 py-3 rounded-full">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5 text-white" />
                ) : (
                  <Mic className="h-5 w-5 text-white" />
                )}
              </button>
              
              <button className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors">
                <Video className="h-5 w-5 text-white" />
              </button>
              
              <button className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors">
                <PhoneOff className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Participant Avatar */}
          <div className="absolute bottom-6 right-6">
            <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">PN</span>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="bg-white px-6 py-4 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${participant.color} rounded-full flex items-center justify-center text-white font-medium`}>
                    {participant.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 bg-white border-l flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
              activeTab === 'chat'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>
          
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
              activeTab === 'transcript'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Transcript</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' ? (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">Start a conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'current-user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'current-user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Transcript Tab */
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <p className="text-sm text-gray-600">
                  Speech-to-text transcription is an automated service and may not be 100% accurate.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {transcript ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {transcript}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Transcript will appear here</p>
                    <p className="text-sm text-gray-400">
                      {isRecording ? 'Recording in progress...' : 'Start recording to see transcription'}
                    </p>
                  </div>
                )}
              </div>

              {/* Transcript Controls */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {isRecording ? 'Recording...' : 'Not recording'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTranscript('')}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transcript);
                        alert('Transcript copied!');
                      }}
                      disabled={!transcript}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="px-4 py-2 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;