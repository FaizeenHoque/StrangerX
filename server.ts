import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173' 
  }
});

const queue: string[] = [];
const socketToRoom = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('client connected:', socket.id);

  socket.on('join_queue', (data: string) => {
    if (queue.length > 0) {
        const partnerID = queue.shift()!;
        const roomID = socket.id + partnerID;

        socket.join(roomID);
        io.sockets.sockets.get(partnerID)?.join(roomID);

        socketToRoom.set(socket.id, roomID);
        socketToRoom.set(partnerID, roomID);

        io.to(roomID).emit('matched', { roomID });
    } else {
        queue.push(socket.id);
    }

    io.emit('queue_update', queue.length); 
  });

  socket.on('leave_queue', () => {
    const idx = queue.indexOf(socket.id);
    if (idx !== -1) queue.splice(idx, 1);
    io.emit('queue_update', queue.length); 
  });

  socket.on('send_message', ({ roomID, message }: { roomID: string; message: string }) => {
    console.log('sending to room:', roomID); 
    socket.to(roomID).emit('message', message);
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom.get(socket.id);

    if (roomID) {
      socket.to(roomID).emit('partner_disconnected');

      socketToRoom.delete(socket.id);
    }

    const idx = queue.indexOf(socket.id);
    if (idx !== -1) queue.splice(idx, 1);

    io.emit('queue_update', queue.length);
  });
});

httpServer.listen(3001, () => {
  console.log('Socket server on port 3001');
});