export interface IReaction {
  reactionId: string;
  authorId: string;
  postId: string;
  type: "❤️" | "👏" | "💪" | "🔥";
}

export class Reaction {
  private reactionId: string;
  private authorId: string;
  private postId: string;
  private type: "❤️" | "👏" | "💪" | "🔥";

  constructor(reaction: IReaction) {
    this.reactionId = reaction.reactionId;
    this.authorId = reaction.authorId;
    this.postId = reaction.postId;
    this.type = reaction.type;
  }

  setReactionId(reactionId: string): void {
    this.reactionId = reactionId;
  }

  getReactionId(): string {
    return this.reactionId;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getPostId(): string {
    return this.postId;
  }

  getType(): "❤️" | "👏" | "💪" | "🔥" {
    return this.type;
  }
}
