const WebSocket = require('ws');
const { Deepgram } = require('@deepgram/sdk');
require('dotenv').config();

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

const setupDeepgramServer = (server, io) => { // Add io parameter
  const wss = new WebSocket.Server({ 
    server,
    path: '/deepgram' // Separate path for Deepgram
  });

  wss.on('connection', (ws) => {
    console.log('Client connected to Deepgram WebSocket');

    const deepgramLive = deepgram.transcription.live({
      punctuate: true,
      language: 'en',
      interim_results: true,
      endpointing: 300
    });

    deepgramLive.on('open', () => {
      console.log('Connected to Deepgram real-time transcription');
    });

    deepgramLive.on('error', (err) => {
      console.error('Deepgram error:', err);
      ws.send(JSON.stringify({ error: 'Transcription error' }));
    });

    deepgramLive.on('transcriptReceived', (transcription) => {
      try {
        const transcript = JSON.parse(transcription);
        const alternatives = transcript.channel?.alternatives;
        
        if (alternatives && alternatives.length > 0) {
          const text = alternatives[0].transcript;
          if (text && text.trim()) {
            // Send to WebSocket client
            ws.send(text);
            
            // Also broadcast via Socket.IO if available
            if (io) {
              io.emit('live-transcript', {
                text: text,
                confidence: alternatives[0].confidence,
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      } catch (error) {
        console.error('Error parsing transcript:', error);
      }
    });

    ws.on('message', (msg) => {
      if (deepgramLive.getReadyState() === 1) {
        deepgramLive.send(msg);
      }
    });

    ws.on('close', () => {
      deepgramLive.finish();
      console.log('Client disconnected from Deepgram');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      deepgramLive.finish();
    });
  });
};

module.exports = setupDeepgramServer;