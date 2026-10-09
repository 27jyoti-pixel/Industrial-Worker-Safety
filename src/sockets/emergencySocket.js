const crypto = require('crypto');
const { Server } = require('socket.io');
const User = require('../models/userModel');
const { verifyToken } = require('../utils/jwtUtils');

let io;
const factoryRoom = (factoryName) => `factory:${crypto.createHash('sha256').update(factoryName.trim().toLowerCase()).digest('hex')}`;

const initializeEmergencySocket = (server) => {
  io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('_id role factoryName isActive');
      if (!user || !user.isActive) return next(new Error('Account unavailable'));
      if (!user.factoryName?.trim()) return next(new Error('Factory association required'));
      socket.data.user = { id: user._id.toString(), role: user.role, factoryName: user.factoryName.trim() };
      return next();
    } catch {
      return next(new Error('Invalid authentication'));
    }
  });
  io.on('connection', (socket) => socket.join(factoryRoom(socket.data.user.factoryName)));
  return io;
};

const emitFactoryEvent = (factoryName, event, payload) => {
  if (!io) return false;
  io.to(factoryRoom(factoryName)).emit(event, payload);
  return true;
};

module.exports = { initializeEmergencySocket, emitFactoryEvent, factoryRoom };
