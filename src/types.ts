import { User } from './contexts/AuthContext';

export interface Store {
  id: number;
  name: string;
  description: string;
  address: string;
  owner: User;
}
