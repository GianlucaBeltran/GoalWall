import { Goal } from "./goals";
import { Comment } from "./comments";
import { IReaction } from "./reaction";

export interface IUser {
  uid: string;
  userNumber: number;
  name: string;
  lastName: string;
  avatarFileName: string;
  goalsIds: string[];
  reactions: IReaction[];
  commentsIds: string[];
  chatsIds: string[];
}

export class User {
  private uid: string;
  private userNumber: number;
  private name: string;
  private lastName: string;
  private avatarFileName: string;
  private goalsIds: string[];
  goals: Goal[];
  private reactions: IReaction[];
  private commentsIds: string[];
  comments: Comment[] = [];
  private chatsIds: string[];

  constructor(user: IUser) {
    this.uid = user.uid;
    this.userNumber = user.userNumber;
    this.name = user.name;
    this.lastName = user.lastName;
    this.avatarFileName = user.avatarFileName;
    this.goalsIds = user.goalsIds;
    this.reactions = user.reactions;
    this.commentsIds = user.commentsIds;
    this.chatsIds = user.chatsIds;
  }

  getUid(): string {
    return this.uid;
  }

  getUserNumber(): number {
    return this.userNumber;
  }

  getName(): string {
    return this.name;
  }

  getLastName(): string {
    return this.lastName;
  }

  getAvatarFileName(): string {
    return this.avatarFileName;
  }

  setAvatarFileName(avatarFileName: string): void {
    this.avatarFileName = avatarFileName;
  }

  getGoals(): string[] {
    return this.goalsIds;
  }

  setGoalsObjects(goals: Goal[]): void {
    this.goals = goals;
  }

  checkIfGoalExists(goalId: string): string | undefined {
    return this.goalsIds.find((goal) => goal === goalId);
  }

  replaceGoal(goal: Goal, goalId: string): void {
    this.goalsIds[goalId] = goal.getGoalId();
    this.goals[goalId] = goal;
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

  getChats(): string[] {
    return this.chatsIds;
  }

  addGoal(goal: string): void {
    this.goalsIds.push(goal);
  }

  addReaction(reaction: IReaction): void {
    this.reactions.push(reaction);
  }

  addComment(comment: string): void {
    this.commentsIds.push(comment);
  }

  addChat(chat: string): void {
    this.chatsIds.push(chat);
  }

  removeGoal(goal: string): void {
    this.goalsIds = this.goalsIds.filter((g) => g !== goal);
  }

  removeReaction(reaction: IReaction): void {
    this.reactions = this.reactions.filter(
      (r) => r.reactionId !== reaction.reactionId
    );
  }

  removeActionsRelatedToPost(postId: string): void {
    this.goalsIds = this.goalsIds.filter((g) => g !== postId);
    this.commentsIds = this.commentsIds.filter((c) => c !== c);
    this.reactions = this.reactions.filter((r) => r.postId !== postId);
  }

  removeComment(comment: string): void {
    this.commentsIds = this.commentsIds.filter((c) => c !== comment);
  }

  removeChat(chatId: string): void {
    this.chatsIds = this.chatsIds.filter((c) => c !== chatId);
  }

  setGoals(goals: string[]): void {
    this.goalsIds = goals;
  }
}
export class Users {
  users: Record<string, User> = {};

  constructor(users: Record<string, IUser>) {
    this.users = Object.values(users).reduce((acc, user) => {
      acc[user.uid] = new User(user);
      return acc;
    }, {});
  }

  findUserByNames(firstName: string, lastName: string): User | undefined {
    return Object.values(this.users).find((user) => {
      return user.getName() === firstName && user.getLastName() === lastName;
    });
  }

  getUsersArray(): User[] {
    return Object.values(this.users);
  }

  findUserByUid(uid: string): User | undefined {
    return this.users[uid];
  }

  getLength(): number {
    return Object.keys(this.users).length;
  }

  addUser(user: User): void {
    this.users[user.getUid()] = user;
  }

  getUsedAvatars(): Set<string> {
    return new Set(
      Object.values(this.users).map((user) => user.getAvatarFileName())
    );
  }
}
