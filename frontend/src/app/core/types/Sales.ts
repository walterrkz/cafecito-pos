export type SaleItemPayload = {
  productId: string;
  quantity: number;
};

export type SalePayload = {
  customerId?: string | null;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  items: SaleItemPayload[];
};

export type CartItem ={
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}