import { User } from "./userModel";

export interface Project {
  _id: string;
  owner: User;
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  financialGoals: string;
  image?: string;
}
