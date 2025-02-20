export interface Deal {
  id: number;
  title: string;
  description: string | null;
  location: string;
  category: string | null;
  price: string | null;
  day: string | null;
  timeWindow: string | null;
  createdAt: Date;
}

// This will be replaced by the API call
export const deals: Deal[] = [];
