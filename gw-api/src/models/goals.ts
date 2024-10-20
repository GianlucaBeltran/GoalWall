import { IReaction } from "./reaction";
import { Comment } from "./comments";
import { Users } from "./users";

export interface IGoal {
  id: string;
  authorId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories: { id: string; name: string }[];
  commentsIds: string[];
  avatarFileName: string;
  reactions: IReaction[];
}

export class Goal {
  private id: string;
  private authorId: string;
  private description: string;
  private createdAt: string;
  private updatedAt: string;
  private categories: { id: string; name: string }[];
  comments: Comment[] = [];
  private commentsIds: string[];
  private avatarFileName: string;
  private reactions: IReaction[];

  constructor(goal: IGoal) {
    this.id = goal.id;
    this.authorId = goal.authorId;
    this.description = goal.description;
    this.createdAt = goal.createdAt;
    this.updatedAt = goal.updatedAt;
    this.categories = goal.categories;
    this.commentsIds = goal.commentsIds;
    this.avatarFileName = goal.avatarFileName;
    this.reactions = goal.reactions;
  }

  getGoalId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  getCategories(): { id: string; name: string }[] {
    return this.categories;
  }

  getAvatarFileName(): string {
    return this.avatarFileName;
  }

  setAvatarFileName(avatarFileName: string): void {
    this.avatarFileName = avatarFileName;
  }

  getReactions(): IReaction[] {
    return this.reactions;
  }

  getComments(): Comment[] {
    return this.comments;
  }

  getCommentsIds(): string[] {
    return this.commentsIds;
  }

  addReaction(reaction: IReaction): void {
    this.reactions.push(reaction);
  }

  addComment(comment: string): void {
    this.commentsIds.push(comment);
  }

  setCommentsObjects(comments: Comment[]): void {
    this.comments = comments;
  }

  removeReaction(reaction: IReaction): void {
    this.reactions = this.reactions.filter(
      (r) => r.reactionId !== reaction.reactionId
    );
  }

  removeActionsRelatedToPost(postId: string): void {
    this.reactions = this.reactions.filter((r) => r.postId !== postId);
    this.commentsIds = this.commentsIds.filter((c) => c !== postId);
  }

  removeComment(comment: Comment): void {
    this.comments = this.comments.filter((c) => c !== comment);
  }
}

export class Goals {
  private goals: Record<string, Goal> = {};

  constructor(goals: Record<string, IGoal>) {
    this.goals = Object.values(goals).reduce((acc, goal) => {
      acc[goal.id] = new Goal(goal);
      return acc;
    }, {});
  }

  findGoalById(goalId: string): Goal | undefined {
    return this.goals[goalId];
  }

  findGoalByAuthorId(authorId: string): Goal | undefined {
    return Object.values(this.goals).find(
      (goal) => goal.getAuthorId() === authorId
    );
  }

  findGoalsByAuthorId(authorId: string): Goal[] {
    return Object.values(this.goals).filter(
      (goal) => goal.getAuthorId() === authorId
    );
  }

  addGoal(goal: Goal): void {
    this.goals[goal.getGoalId()] = goal;
  }

  removeGoal(goal: Goal): void {
    delete this.goals[goal.getGoalId()];
  }

  replaceGoal(goal: Goal): void {
    console.log("Replacing goal", goal);
    this.goals[goal.getGoalId()] = goal;
  }

  getGoals(): Record<string, Goal> {
    return this.goals;
  }

  getUnownedGoals(authorId: string): Goal[] {
    return Object.values(this.goals).filter(
      (goal) => goal.getAuthorId() !== authorId
    );
  }

  getGoalsArrayWithAvatar(users: Users): Goal[] {
    return Object.values(this.goals).map((goal) => {
      goal.setAvatarFileName(
        users.users[goal.getAuthorId()].getAvatarFileName()
      );
      return goal;
    });
  }

  getGoalsArray(): Goal[] {
    return Object.values(this.goals);
  }
}
