import { Goal, Comment, User, Reaction } from "./api.types";

// export interface User {
//   uid: string;
//   userNumber: number;
//   name: string;
//   lastName: string;
//   avatarFileName: string;
//   goals: Goal[];
//   reactions: Reaction[];
//   comments: Comment[];
//   chats: Chat[];
// }

// import { User } from "./api.types";
export class Users {
  id: string;
  userNumber: number;
  name: string;
  lastName: string;
  avatarFileName: string;
  goals: string[];
  reactions: Reaction[];
  chats: string[];

  constructor(user: User) {
    this.id = user.uid;
    this.userNumber = user.userNumber;
    this.name = user.name;
    this.lastName = user.lastName;
    this.avatarFileName = user.avatarFileName;
    this.goals = user.goals.map((goal) => goal.id);
    this.reactions = user.reactions;
    this.chats = user.chats.map((chat) => chat.id);
  }
}
