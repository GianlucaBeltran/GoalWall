import { io } from "socket.io-client";
import { url } from "../constants/apiEndpoints";

export const socket = io(url, {
  auth: {
    userId: "goalWallScreen",
  },
  autoConnect: true,
});
