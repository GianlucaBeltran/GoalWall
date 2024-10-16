export interface DirectMessage {
  id: string;
  authorId: string;
  recipientId: string;
  message: string;
  createdAt: string;
}

export interface Chat {
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

export interface Reaction {
  reactionId: string;
  authorId: string;
  postId: string;
  type: "❤️" | "👏" | "💪" | "🔥";
}

export interface Comment {
  id: string;
  authorId: string;
  avatarFileName: string;
  description: string;
  createdAt: string;
  goalId: string;
  reactions: Reaction[];
}

export interface Goal {
  id: string;
  authorId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories?: { id: string; name: string }[];
  comments?: Comment[];
  avatarFileName?: string;
  reactions: Reaction[];
}

export interface User {
  uid: string;
  userNumber: number;
  name: string;
  lastName: string;
  avatarFileName: string;
  goals: Goal[];
  reactions: Reaction[];
  chats: Chat[];
}
