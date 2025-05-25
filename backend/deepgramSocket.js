const { createClient } = require('@deepgram/sdk'); // ✅ updated for v3
require('dotenv').config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY); // ✅ v3 syntax

function setupDeepgramServer(io) {
  io.on('connection', (socket) => {
    console.log('Client connected for Deepgram transcription');

    let deepgramLive;

    socket.on('start-audio', async (message) => {
      try {
        if (!deepgramLive) {
          deepgramLive = await deepgram.listen.live({
            model: 'general',
            language: 'en-US',
            interim_results: true
          });

          deepgramLive.on('transcriptReceived', (data) => {
            const transcript = JSON.parse(data).channel.alternatives[0].transcript;
            if (transcript) {
              socket.emit('transcript', transcript); // Send back to client
            }
          });

          deepgramLive.on('error', (err) => {
            console.error('Deepgram error:', err);
            socket.disconnect();
          });
        }

        // Send audio buffer to Deepgram
        deepgramLive.send(message);
      } catch (err) {
        console.error('Deepgram setup failed:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from Deepgram');
      if (deepgramLive) {
        deepgramLive.finish();
      }
    });
  });
}

module.exports = setupDeepgramServer;
