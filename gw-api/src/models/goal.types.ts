export interface Goal {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories?: string[];
  avatarFileName: string;
}
