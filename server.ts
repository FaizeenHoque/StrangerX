import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'https://strangerx.vercel.app/' 
  }
});

const queue: string[] = [];
const socketToRoom = new Map<string, string>();

let online_count = 0;
let activeChats = 0;

io.on('connection', (socket) => {
  online_count++;
  io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats })
  
  console.log('client connected:', socket.id);

  socket.on('join_queue', (data: string) => {
    if (queue.length > 0) {
        const partnerID = queue.shift()!;
        const roomID = socket.id + partnerID;

        socket.join(roomID);
        io.sockets.sockets.get(partnerID)?.join(roomID);

        socketToRoom.set(socket.id, roomID);
        socketToRoom.set(partnerID, roomID);

        
        activeChats++;
        io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats })
        io.to(roomID).emit('matched', { roomID });
    } else {
        queue.push(socket.id);
    }

    io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats })
  });

  socket.on('leave_queue', () => {
    const idx = queue.indexOf(socket.id);
    if (idx !== -1) queue.splice(idx, 1);
    io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats })
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

        // Only decrement if the OTHER person is still mapped to this room
        // i.e. we're the first to leave
        const roomStillActive = [...socketToRoom.values()].includes(roomID);
        if (!roomStillActive) {
            activeChats--;
        }

        io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats });
    }

    const idx = queue.indexOf(socket.id);
    if (idx !== -1) queue.splice(idx, 1);

    online_count--;
    io.emit('stats_update', { online: online_count, queue: queue.length, chats: activeChats });
  });
});

httpServer.listen(3001, () => {
  console.log('Socket server on port 3001');
});