export interface User {
  id: string;
  stream?: MediaStream;
}

export interface RoomState {
  roomId: string;
  users: Map<string, User>;
  localStream?: MediaStream;
}