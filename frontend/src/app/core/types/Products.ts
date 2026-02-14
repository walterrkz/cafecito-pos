export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};