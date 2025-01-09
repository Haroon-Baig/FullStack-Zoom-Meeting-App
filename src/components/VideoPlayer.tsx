import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream: MediaStream;
  muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, muted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="rounded-lg w-full h-full object-cover"
    />
  );
};