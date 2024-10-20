import { DirectMessage } from "./directMessage";

export interface ChatData {
  chat: Chat;
  otherUserId: string;
  otherUserName: string;
  otherUserLastName: string;
  otherUserAvatar: string;
}

export interface IChat {
  id: string;
  creatorId: string;
  users: {
    userId: string;
    userName: string;
    userLastName: string;
    userAvatarFileName: string;
  }[];
  messages: DirectMessage[];
  status: "accepted" | "pending" | "rejected" | "new";
  createdAt: string;
}

export class Chat {
  private id: string;
  private creatorId: string;
  private users: {
    userId: string;
    userName: string;
    userLastName: string;
    userAvatarFileName: string;
  }[];
  private messages: DirectMessage[];
  private status: "accepted" | "pending" | "rejected" | "new";
  private createdAt: string;

  constructor(chat: IChat) {
    this.id = chat.id;
    this.creatorId = chat.creatorId;
    this.users = chat.users;
    this.messages = chat.messages;
    this.status = chat.status;
    this.createdAt = chat.createdAt;
  }

  getId(): string {
    return this.id;
  }

  getCreatorId(): string {
    return this.creatorId;
  }

  getUsers(): {
    userId: string;
    userName: string;
    userLastName: string;
    userAvatarFileName: string;
  }[] {
    return this.users;
  }

  getMessages(): DirectMessage[] {
    return this.messages;
  }

  addMessage(message: DirectMessage) {
    this.messages.push(message);
  }

  getStatus(): "accepted" | "pending" | "rejected" | "new" {
    return this.status;
  }

  setStatus(status: "accepted" | "pending" | "rejected" | "new") {
    this.status = status;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }
}

export class Chats {
  private chats: Record<string, Chat> = {};

  constructor(chats: Record<string, IChat>) {
    this.chats = Object.values(chats).reduce((acc, chat) => {
      acc[chat.id] = new Chat({
        id: chat.id,
        creatorId: chat.creatorId,
        users: chat.users,
        messages: chat.messages,
        status: chat.status,
        createdAt: chat.createdAt,
      });
      return acc;
    }, {});
  }

  findChatById(chatId: string): Chat | undefined {
    return this.chats[chatId];
  }

  addChat(chat: Chat): void {
    this.chats[chat.getId()] = chat;
  }

  removeChat(chat: Chat): void {
    delete this.chats[chat.getId()];
  }

  getChats(): Record<string, Chat> {
    return this.chats;
  }

  getChatsArray(): Chat[] {
    return Object.values(this.chats);
  }

  getChatsByUserId(userId: string): Chat[] {
    return Object.values(this.chats).filter((chat) =>
      chat.getUsers().find((user) => user.userId === userId)
    );
  }

  getChatByUsersIds(userId: string, recipientId: string): Chat | undefined {
    return Object.values(this.chats).find(
      (chat) =>
        chat.getUsers().find((user) => user.userId === userId) &&
        chat.getUsers().find((user) => user.userId === recipientId)
    );
  }
}
