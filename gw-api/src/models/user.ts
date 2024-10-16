import { DirectMessage } from "./api.types";

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
    console.log("Replacing comment", comment);
    this.comments[comment.getId()] = comment;
  }

  getComments(): Record<string, Comment> {
    return this.comments;
  }

  getCommentsArray(): Comment[] {
    return Object.values(this.comments);
  }
}

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

  getGoalsArray(): Goal[] {
    return Object.values(this.goals);
  }
}

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
    console.log("Replacing goal", goal);
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
}
