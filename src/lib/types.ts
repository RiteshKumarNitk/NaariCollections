export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'suits' | 'sarees' | 'kurtis' | 'dresses';
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
