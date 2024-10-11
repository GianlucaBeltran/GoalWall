import { Goal } from "./goal.types";

export interface User {
  uid: string;
  name: string;
  lastName: string;
  gender?: "Male" | "Female" | "Other";
  avatar?: string;
  goals?: Goal[];
}
