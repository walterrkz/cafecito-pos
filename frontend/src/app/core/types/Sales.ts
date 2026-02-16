export type SaleItemPayload = {
  productId: string;
  quantity: number;
};

export type SalePayload = {
  customerId?: string | null;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  items: SaleItemPayload[];
};

export type CartItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type TicketItem = {
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type Ticket = {
  saleId: string;
  timestamp: string;
  storeName: string;
  items: TicketItem[];
  subtotal: number;
  discount: string;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
};

export type Sale = {
  saleId: string;
  customerId: string | null;
  paymentMethod: 'cash' | 'card' | 'transfer';
  items: SaleItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  ticket: Ticket;
  createdAt: string;
};

export type SaleListItem = {
  saleId: string;
  customerName: string | null;
  paymentMethod: 'cash' | 'card' | 'transfer';
  total: number;
  createdAt: string;
};