export interface DirectMessage {
  id: string;
  authorId: string;
  recipientId: string;
  message: string;
  createdAt: string;
}

export interface Reaction {
  authorId: string;
  postId: string;
  type: "❤️" | "👏" | "💪" | "🔥";
}

export interface Comment {
  id: string;
  authorId: string;
  description: string;
  avatarFileName: string;
  createdAt: string;
  goalId: string;
  reactions: Reaction[];
}

export interface Category {
  id: string;
  name: string;
}
export interface Goal {
  id: string;
  authorId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
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
  comments: Comment[];
  reactions: Reaction[];
  messages: DirectMessage[];
}

export interface SelectedItem {
  item: Goal | Comment;
  isGoal: boolean;
  owned: boolean;
  avatarFileName?: string;
  indexInFlatList?: number;
  parentGoalId?: string;
  parentGoal?: Goal;
  origin: "sharedGoals" | "othersGoals" | "goalWall";
}
