import { io } from "socket.io-client";
import { urlHome } from "../constants/apiEndpoints";

export const socket = io(urlHome, {
  auth: {
    userId: "goalWallScreen",
  },
  autoConnect: true,
});
