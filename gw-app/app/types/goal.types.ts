import { Avatar } from "../constants/avatars";

export interface Goal {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories?: string[];
  avatar?: Avatar;
  avatarFileName: string;
}
