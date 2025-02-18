export interface Deal {
  id: number;
  name: string;
  location: {
    lng: number;
    lat: number;
  };
  category: string;
}

export const deals: Deal[] = [
  {
    id: 1,
    name: "50% Off Pizza",
    category: "Food",
    location: { lng: 18.4233, lat: -33.9188 },
  },
  {
    id: 2,
    name: "Buy 1 Get 1 Coffee",
    category: "Food",
    location: { lng: 18.4241, lat: -33.9258 },
  },
  {
    id: 3,
    name: "20% Off Gym Membership",
    category: "Fitness",
    location: { lng: 18.4296, lat: -33.9166 },
  },
  {
    id: 4,
    name: "50% Off Sneakers",
    category: "Shopping",
    location: { lng: 18.4265, lat: -33.9249 },
  },
];
