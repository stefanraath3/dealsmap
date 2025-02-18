export interface Deal {
  id: number;
  name: string;
  location: {
    lng: number;
    lat: number;
  };
}

export const deals: Deal[] = [
  { id: 1, name: "50% Off Pizza", location: { lng: 18.4233, lat: -33.9188 } }, // Cape Town
  {
    id: 2,
    name: "Buy 1 Get 1 Coffee",
    location: { lng: 18.4241, lat: -33.9258 },
  },
  {
    id: 3,
    name: "20% Off Gym Membership",
    location: { lng: 18.4296, lat: -33.9166 },
  },
];
