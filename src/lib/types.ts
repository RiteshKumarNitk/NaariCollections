
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'suits' | 'sarees' | 'kurtis' | 'dresses' | 'kaftans' | 'anarkali' | 'indo-western' | 'coord-sets';
  sizes: string[];
  fabric: string;
  code: string;
  creationDate: string; // ISO 8601 date string
  bestseller: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  code: string;
};

// For simulated authentication
export type User = {
  email: string;
};

export type AdminUser = {
  email: string;
  password?: string; // This should not exist in a real User type
};
