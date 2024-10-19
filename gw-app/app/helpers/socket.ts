import { io } from "socket.io-client";
import { url } from "../constants/apiEndpoints";

export function connectSocket(userId: string) {
  const socket = io(url, {
    auth: {
      userId,
    },
  });
  return socket;
}
