import { IReaction } from "./reaction";

export interface IComment {
  id: string;
  authorId: string;
  avatarFileName: string;
  description: string;
  createdAt: string;
  goalId: string;
  reactions: IReaction[];
}

export class Comment {
  private id: string;
  private authorId: string;
  private avatarFileName: string;
  private description: string;
  private createdAt: string;
  private goalId: string;
  private reactions: IReaction[];

  constructor(comment: IComment) {
    this.id = comment.id;
    this.authorId = comment.authorId;
    this.avatarFileName = comment.avatarFileName;
    this.description = comment.description;
    this.createdAt = comment.createdAt;
    this.goalId = comment.goalId;
    this.reactions = comment.reactions;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getAvatarFileName(): string {
    return this.avatarFileName;
  }

  setAvatarFileName(avatarFileName: string): void {
    this.avatarFileName = avatarFileName;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getGoalId(): string {
    return this.goalId;
  }

  getReactions(): IReaction[] {
    return this.reactions;
  }

  addReaction(reaction: IReaction): void {
    this.reactions.push(reaction);
  }

  removeReaction(reaction: IReaction): void {
    this.reactions = this.reactions.filter(
      (r) => r.reactionId !== reaction.reactionId
    );
  }
}

export class Comments {
  private comments: Record<string, Comment> = {};

  constructor(comments: Record<string, IComment>) {
    this.comments = Object.values(comments).reduce((acc, comment) => {
      acc[comment.id] = new Comment(comment);
      return acc;
    }, {});
  }

  findCommentById(commentId: string): Comment | undefined {
    return this.comments[commentId];
  }

  findCommentsByGoalId(goalId: string): Comment[] {
    return Object.values(this.comments).filter(
      (comment) => comment.getGoalId() === goalId
    );
  }

  addComment(comment: Comment): void {
    this.comments[comment.getId()] = comment;
  }

  removeComment(comment: string): void {
    delete this.comments[comment];
  }

  replaceComment(comment: Comment): void {
    this.comments[comment.getId()] = comment;
  }

  getComments(): Record<string, Comment> {
    return this.comments;
  }

  getCommentsArray(): Comment[] {
    return Object.values(this.comments);
  }
}
