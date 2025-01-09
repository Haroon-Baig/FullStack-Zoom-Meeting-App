import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './components/Room';
import { Video } from 'lucide-react';

const socket = io('http://localhost:3000');

function App() {
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const userId = uuidv4();

  const createRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    setIsInRoom(true);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      setIsInRoom(true);
    }
  };

  if (isInRoom) {
    return <Room socket={socket} roomId={roomId} userId={userId} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Video className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Video Meeting
        </h1>
        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Create New Room
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={joinRoom}
              disabled={!roomId.trim()}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;