export interface User {
  uid: number;
  name: string;
  lastName: string;
  gender?: "Male" | "Female" | "Other";
  avatar?: string;
}