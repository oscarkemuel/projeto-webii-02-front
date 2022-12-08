import { User } from './contexts/AuthContext';

export interface Store {
  id: number;
  name: string;
  description: string;
  address: string;
  owner: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Sale {
  id: number;
  created_at: string;
  quantity: number;
  price: number;
  product: Product;
  seller: {
    user: User;
  };
}

export interface Seller {
  id: number;
  user: User;
}
