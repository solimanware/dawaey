export interface PriceHistory {
  date: Date;
  value: number;
}

export interface Drug {
  id: number;
  tradename: string;
  activeingredient: string;
  price: number;
  company: string;
  group: string;
  pamphlet: string;
  priceHistory: PriceHistory[];
}
