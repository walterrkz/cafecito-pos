export type Customer = {
  id: string;
  name: string;
  phoneOrEmail: string;
  purchasesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CustomersResponse = {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
};