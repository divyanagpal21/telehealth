const { Server } = require('socket.io');

const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Store active consultations and participants
  const activeConsultations = new Map();
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join consultation room
    socket.on('join-consultation', (consultationId, userInfo) => {
      socket.join(consultationId);
      
      // Store user info
      userSockets.set(socket.id, {
        consultationId,
        userInfo
      });

      // Add to active consultation
      if (!activeConsultations.has(consultationId)) {
        activeConsultations.set(consultationId, {
          participants: [],
          messages: [],
          transcripts: []
        });
      }

      const consultation = activeConsultations.get(consultationId);
      consultation.participants.push({
        socketId: socket.id,
        ...userInfo
      });

      // Notify others in the room
      socket.to(consultationId).emit('user-joined', userInfo);
      
      // Send existing messages and transcripts to new user
      socket.emit('consultation-history', {
        messages: consultation.messages,
        transcripts: consultation.transcripts
      });
    });

    // Handle chat messages
    socket.on('message', (messageData) => {
      const user = userSockets.get(socket.id);
      if (user) {
        const message = {
          ...messageData,
          timestamp: new Date().toISOString()
        };

        // Store message
        const consultation = activeConsultations.get(user.consultationId);
        if (consultation) {
          consultation.messages.push(message);
        }

        // Broadcast to all users in the consultation
        io.to(user.consultationId).emit('message', message);
      }
    });

    // Handle transcript updates
    socket.on('transcript', (transcriptData) => {
      const user = userSockets.get(socket.id);
      if (user) {
        const transcript = {
          ...transcriptData,
          timestamp: new Date().toISOString(),
          speaker: user.userInfo.name
        };

        // Store transcript
        const consultation = activeConsultations.get(user.consultationId);
        if (consultation) {
          consultation.transcripts.push(transcript);
        }

        // Broadcast to all users in the consultation
        socket.to(user.consultationId).emit('transcript-update', transcript);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      const user = userSockets.get(socket.id);
      if (user) {
        // Remove from active consultation
        const consultation = activeConsultations.get(user.consultationId);
        if (consultation) {
          consultation.participants = consultation.participants.filter(
            p => p.socketId !== socket.id
          );
          
          // If no participants left, clean up
          if (consultation.participants.length === 0) {
            activeConsultations.delete(user.consultationId);
          }
        }

        // Notify others in the room
        socket.to(user.consultationId).emit('user-left', user.userInfo);
        
        userSockets.delete(socket.id);
      }
    });
  });

  return io;
};

module.exports = setupSocketServer;