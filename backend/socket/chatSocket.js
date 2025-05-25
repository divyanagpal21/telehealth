const { Server } = require('socket.io');

const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Change this to match your frontend
      methods: ["GET", "POST"]
    }
  });

  // Store active consultations and user sessions
  const activeConsultations = new Map();
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a consultation room
    socket.on('join-consultation', ({ consultationId, userInfo }) => {
      if (!consultationId || !userInfo) return;

      socket.join(consultationId);

      // Track user session
      userSockets.set(socket.id, { consultationId, userInfo });

      // Initialize consultation if not existing
      if (!activeConsultations.has(consultationId)) {
        activeConsultations.set(consultationId, {
          participants: [],
          messages: [],
          transcripts: []
        });
      }

      const consultation = activeConsultations.get(consultationId);
      consultation.participants.push({ socketId: socket.id, ...userInfo });

      // Notify others
      socket.to(consultationId).emit('user-joined', userInfo);

      // Send current state to the user
      socket.emit('consultation-history', {
        messages: consultation.messages,
        transcripts: consultation.transcripts
      });
    });

    // Handle incoming chat messages
    socket.on('message', (messageData) => {
      const user = userSockets.get(socket.id);
      if (!user) return;

      const message = {
        ...messageData,
        timestamp: new Date().toISOString()
      };

      const consultation = activeConsultations.get(user.consultationId);
      if (consultation) {
        consultation.messages.push(message);
        io.to(user.consultationId).emit('message', message);
      }
    });

    // Handle incoming transcript updates
    socket.on('transcript', (transcriptData) => {
      const user = userSockets.get(socket.id);
      if (!user) return;

      const transcript = {
        ...transcriptData,
        timestamp: new Date().toISOString(),
        speaker: user.userInfo.name
      };

      const consultation = activeConsultations.get(user.consultationId);
      if (consultation) {
        consultation.transcripts.push(transcript);
        socket.to(user.consultationId).emit('transcript-update', transcript);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      const user = userSockets.get(socket.id);
      if (user) {
        const { consultationId, userInfo } = user;
        const consultation = activeConsultations.get(consultationId);

        if (consultation) {
          consultation.participants = consultation.participants.filter(p => p.socketId !== socket.id);

          // Clean up empty consultations
          if (consultation.participants.length === 0) {
            activeConsultations.delete(consultationId);
          }

          // Notify others
          socket.to(consultationId).emit('user-left', userInfo);
        }

        userSockets.delete(socket.id);
      }
    });
  });

  return io;
};

module.exports = setupSocketServer;
