export interface Reaction {
  reactionId: string;
  authorId: string;
  postId: string;
  type: "❤️" | "👏" | "💪" | "🔥";
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
  avatarFileName?: string;
  reactions: Reaction[];
}
