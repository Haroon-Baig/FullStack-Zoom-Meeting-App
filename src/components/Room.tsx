import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { VideoPlayer } from './VideoPlayer';
import { User, RoomState } from '../types';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy } from 'lucide-react';

interface RoomProps {
  socket: Socket;
  roomId: string;
  userId: string;
}

export const Room: React.FC<RoomProps> = ({ socket, roomId, userId }) => {
  const [roomState, setRoomState] = useState<RoomState>({
    roomId,
    users: new Map(),
    localStream: undefined,
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setRoomState(prev => ({
          ...prev,
          localStream: stream,
        }));
        socket.emit('join-room', roomId, userId);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      roomState.localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleAudio = () => {
    if (roomState.localStream) {
      const audioTrack = roomState.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (roomState.localStream) {
      const videoTrack = roomState.localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const leaveRoom = () => {
    roomState.localStream?.getTracks().forEach(track => track.stop());
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="text-white">
            <span className="text-sm text-gray-400">Room ID:</span>
            <span className="ml-2 font-mono">{roomId}</span>
          </div>
          <button
            onClick={copyRoomId}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomState.localStream && (
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <VideoPlayer stream={roomState.localStream} muted />
              <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                You
              </div>
            </div>
          )}
          {Array.from(roomState.users.values()).map((user) => (
            user.stream && (
              <div key={user.id} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <VideoPlayer stream={user.stream} />
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  Participant
                </div>
              </div>
            )
          ))}
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 rounded-full px-6 py-3">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-600' : 'bg-red-500'}`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'}`}
          >
            {isVideoEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={leaveRoom}
            className="p-3 rounded-full bg-red-500"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};