import { ChatData } from "../context/appContext";
import { Chat, User } from "../types/data.types";

export function constructMessageDispatch(chat: Chat, senderId: string) {
  const chatData: ChatData = {
    chat,
    otherUserId:
      chat.users.find((user) => user.userId !== senderId)?.userId || "",
    otherUserName:
      chat.users.find((user) => user.userId !== senderId)?.userName || "",
    otherUserLastName:
      chat.users.find((user) => user.userId !== senderId)?.userLastName || "",
    otherUserAvatar:
      chat.users.find((user) => user.userId !== senderId)?.userAvatarFileName ||
      "",
  };

  return chatData;
}
