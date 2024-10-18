import { io } from "socket.io-client";
import { urlHome, urlNgrok } from "../constants/apiEndpoints";

export function connectSocket(userId: string) {
  const socket = io(urlHome, {
    auth: {
      userId,
    },
  });
  return socket;
}
