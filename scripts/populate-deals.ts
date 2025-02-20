import type { InferModel } from "drizzle-orm";
import { db } from "../db/db.js";
import { deals, OperatingHours } from "../db/schema.js";

type NewDeal = InferModel<typeof deals, "insert">;

// Updated Cape Town area coordinates
const locations = {
  "Tygers Milk": { lat: -33.90114315007911, lng: 18.420217675682395 },
  "Vida Cafe": { lat: -33.89277654251257, lng: 18.509713733828317 },
  "Den Anker, V&A Waterfront": {
    lat: -33.905885671089564,
    lng: 18.42119832557682,
  },
  "Grand Pavilion, Sea Point": {
    lat: -33.91822715366131,
    lng: 18.38599140715817,
  },
  Rockefeller: { lat: -33.92030421199006, lng: 18.433828752292015 },
  "Cafe Caprice, Camps Bay": {
    lat: -33.95048407781989,
    lng: 18.378586623728236,
  },
  "Turn n Tender": { lat: -33.85825474414991, lng: 18.613257249471665 },
  "Koffie Therapy": { lat: -33.869387434034735, lng: 18.63140131208252 },
  "Copper Club": { lat: -33.87623539236907, lng: 18.630161454411375 },
  Bossa: { lat: -33.874243733791644, lng: 18.62918515256114 },
  Tortilla: { lat: -33.89264487999799, lng: 18.51052016975496 },
  "Asami's": { lat: -33.87235527472244, lng: 18.63399035441119 },
  NOB: { lat: -33.87386206327206, lng: 18.62894151558164 },
  Panarottis: { lat: -33.872182414015846, lng: 18.633792254411297 },
  "Burger and Lobster, Bree Street": {
    lat: -33.92117301348505,
    lng: 18.418075779548488,
  },
  Steers: { lat: -33.87373044841233, lng: 18.6346775390683 },
} as const;

const defaultOperatingHours: OperatingHours = {
  monday: { open: "09:00", close: "22:00" },
  tuesday: { open: "09:00", close: "22:00" },
  wednesday: { open: "09:00", close: "22:00" },
  thursday: { open: "09:00", close: "22:00" },
  friday: { open: "09:00", close: "23:00" },
  saturday: { open: "09:00", close: "23:00" },
  sunday: { open: "09:00", close: "22:00" },
};

const defaultDealValues = {
  isRecurring: true,
  isActive: true,
  operatingHours: defaultOperatingHours,
} as const;

async function populateDeals() {
  try {
    // Every day deals
    const everydayDeals: NewDeal[] = [
      {
        title: "Varsity Vibe 30% Tygers Milk",
        description: "30% off at Tygers Milk",
        location: "Tygers Milk",
        latitude: locations["Tygers Milk"].lat.toString(),
        longitude: locations["Tygers Milk"].lng.toString(),
        category: "Food",
        timeWindow: "before 4pm",
        startTime: "09:00",
        endTime: "16:00",
        day: "Every day",
        price: null,
        originalPrice: null,
        images: [
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
        ],
        ...defaultDealValues,
      },
      {
        title: "Vida Cafe 20% Varsity Vibe",
        description: "20% off at Vida Cafe with varsity vibe",
        location: "Vida Cafe",
        latitude: locations["Vida Cafe"].lat.toString(),
        longitude: locations["Vida Cafe"].lng.toString(),
        category: "Food",
        day: "Every day",
        price: null,
        originalPrice: null,
        images: [
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        ],
        ...defaultDealValues,
      },
      {
        title: "Den Anker Breakfast Special",
        description: "Breakfast special and mimosa R120",
        location: "Den Anker, V&A Waterfront",
        latitude: locations["Den Anker, V&A Waterfront"].lat.toString(),
        longitude: locations["Den Anker, V&A Waterfront"].lng.toString(),
        category: "Food",
        price: "120",
        originalPrice: "180",
        timeWindow: "until 11am",
        startTime: "09:00",
        endTime: "11:00",
        day: "Every day",
        images: [
          "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
          "https://images.unsplash.com/photo-1550547660-d9450f859349",
        ],
        ...defaultDealValues,
      },
      {
        title: "Grand Pavilion Sea-point sushi and cocktails",
        description: "Half price cocktails and sushi",
        location: "Grand Pavilion, Sea Point",
        latitude: locations["Grand Pavilion, Sea Point"].lat.toString(),
        longitude: locations["Grand Pavilion, Sea Point"].lng.toString(),
        category: "Food",
        timeWindow: "12pm to 5pm",
        day: "Every day",
        price: null,
        images: [
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
          "https://images.unsplash.com/photo-1563245372-f21724e3856d",
        ],
        ...defaultDealValues,
      },
      {
        title: "Rockefeller Monday-Thursday special",
        description: "2 for one pizza and cocktail",
        location: "Rockefeller",
        latitude: locations["Rockefeller"].lat.toString(),
        longitude: locations["Rockefeller"].lng.toString(),
        category: "Food",
        timeWindow: "5pm to 7pm",
        day: "Every day",
        price: null,
        ...defaultDealValues,
      },
      {
        title: "Cafe caprice happy hour",
        description: "Happy hour at Camps Bay",
        location: "Cafe Caprice, Camps Bay",
        latitude: locations["Cafe Caprice, Camps Bay"].lat.toString(),
        longitude: locations["Cafe Caprice, Camps Bay"].lng.toString(),
        category: "Food",
        timeWindow: "4pm-6pm",
        day: "Every day",
        price: null,
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(everydayDeals);

    // Monday deals
    const mondayDeals: NewDeal[] = [
      {
        title: "Turn n Tender Burger Special",
        description: "R85 burger + chips special",
        location: "Turn n Tender",
        latitude: locations["Turn n Tender"].lat.toString(),
        longitude: locations["Turn n Tender"].lng.toString(),
        category: "Food",
        price: "85",
        originalPrice: "120",
        day: "Monday",
        ...defaultDealValues,
      },
      {
        title: "Koffie therapy 2 for 1 breakfast",
        description: "R62 2 for 1 breakfast special",
        location: "Koffie Therapy",
        latitude: locations["Koffie Therapy"].lat.toString(),
        longitude: locations["Koffie Therapy"].lng.toString(),
        category: "Food",
        price: "62",
        timeWindow: "7-11am",
        day: "Monday",
        ...defaultDealValues,
      },
      {
        title: "Copper club half priced pizza",
        description: "Half price on all pizzas",
        location: "Copper Club",
        latitude: locations["Copper Club"].lat.toString(),
        longitude: locations["Copper Club"].lng.toString(),
        category: "Food",
        day: "Monday",
        price: null,
        ...defaultDealValues,
      },
      {
        title: "Bossa burger special",
        description: "Burger, chips and onions R75",
        location: "Bossa",
        latitude: locations["Bossa"].lat.toString(),
        longitude: locations["Bossa"].lng.toString(),
        category: "Food",
        price: "75",
        day: "Monday",
        ...defaultDealValues,
      },
      {
        title: "Spur cheese burger special",
        description: "R69 before 4pm, R70 after 4pm",
        location: "Spur",
        category: "Food",
        price: "69",
        day: "Monday",
        latitude: "-33.87373044841233",
        longitude: "18.6346775390683",
        ...defaultDealValues,
      },
      {
        title: "Asami's B1G1 free noodles",
        description: "Buy 1 Get 1 free noodles chicken chow mein",
        location: "Asami's",
        latitude: locations["Asami's"].lat.toString(),
        longitude: locations["Asami's"].lng.toString(),
        category: "Food",
        day: "Monday",
        price: null,
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(mondayDeals);

    // Tuesday deals
    const tuesdayDeals: NewDeal[] = [
      {
        title: "Half priced burgers at Copper Club",
        description: "All burgers half price",
        location: "Copper Club",
        latitude: locations["Copper Club"].lat.toString(),
        longitude: locations["Copper Club"].lng.toString(),
        category: "Food",
        day: "Tuesday",
        price: null,
        ...defaultDealValues,
      },
      {
        title: "NOB two burgers special",
        description: "R170 for two burgers",
        location: "NOB",
        latitude: locations["NOB"].lat.toString(),
        longitude: locations["NOB"].lng.toString(),
        category: "Food",
        price: "170",
        day: "Tuesday",
        ...defaultDealValues,
      },
      {
        title: "Tigers milk pizza special",
        description: "2 pizzas for R200",
        location: "Tigers Milk",
        latitude: locations["Tygers Milk"].lat.toString(),
        longitude: locations["Tygers Milk"].lng.toString(),
        category: "Food",
        price: "200",
        day: "Tuesday",
        ...defaultDealValues,
      },
      {
        title: "Panarottis pizza and pasta special",
        description: "R90 pizza and pasta",
        location: "Panarottis",
        latitude: locations["Panarottis"].lat.toString(),
        longitude: locations["Panarottis"].lng.toString(),
        category: "Food",
        price: "90",
        day: "Tuesday",
        ...defaultDealValues,
      },
      {
        title: "Burger and lobster Cape Town special",
        description: "R199 for two burgers",
        location: "Burger and Lobster, Bree Street",
        latitude: locations["Burger and Lobster, Bree Street"].lat.toString(),
        longitude: locations["Burger and Lobster, Bree Street"].lng.toString(),
        category: "Food",
        price: "199",
        day: "Tuesday",
        ...defaultDealValues,
      },
      {
        title: "Cafe Caprice burger and cocktail special",
        description: "Two for one burger special and half price cocktails",
        location: "Cafe Caprice",
        latitude: locations["Cafe Caprice, Camps Bay"].lat.toString(),
        longitude: locations["Cafe Caprice, Camps Bay"].lng.toString(),
        category: "Food",
        timeWindow: "4pm to 6pm",
        day: "Tuesday",
        price: null,
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(tuesdayDeals);

    // Wednesday deals
    const wednesdayDeals: NewDeal[] = [
      {
        title: "Wacky Wednesday steers",
        description: "Wednesday steak special",
        location: "Steers",
        latitude: locations["Steers"].lat.toString(),
        longitude: locations["Steers"].lng.toString(),
        category: "Food",
        day: "Wednesday",
        price: null,
        ...defaultDealValues,
      },
      {
        title: "Copper Club 2 for 1",
        description: "2 burgers/pizza for R195",
        location: "Copper Club",
        latitude: locations["Copper Club"].lat.toString(),
        longitude: locations["Copper Club"].lng.toString(),
        category: "Food",
        price: "195",
        day: "Wednesday",
        ...defaultDealValues,
      },
      {
        title: "Half priced cocktails",
        description: "All cocktails half price",
        location: "Copper Club",
        latitude: locations["Copper Club"].lat.toString(),
        longitude: locations["Copper Club"].lng.toString(),
        category: "Food",
        day: "Wednesday",
        price: null,
        ...defaultDealValues,
      },
      {
        title: "Tortilla 2 For one burritos",
        description: "Buy one get one free burritos",
        location: "Tortilla",
        latitude: locations["Tortilla"].lat.toString(),
        longitude: locations["Tortilla"].lng.toString(),
        category: "Food",
        day: "Wednesday",
        price: null,
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(wednesdayDeals);

    // Thursday deals
    const thursdayDeals: NewDeal[] = [
      {
        title: "Copper Club chicken schnitzel",
        description: "Chicken schnitzel special R120",
        location: "Copper Club",
        latitude: locations["Copper Club"].lat.toString(),
        longitude: locations["Copper Club"].lng.toString(),
        category: "Food",
        price: "120",
        day: "Thursday",
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(thursdayDeals);

    // Sunday deals
    const sundayDeals: NewDeal[] = [
      {
        title: "Rockefeller hotel sushi buffet",
        description: "Sushi buffet for R229 pp",
        location: "Rockefeller",
        latitude: locations["Rockefeller"].lat.toString(),
        longitude: locations["Rockefeller"].lng.toString(),
        category: "Food",
        price: "229",
        day: "Sunday",
        ...defaultDealValues,
      },
    ];

    await db.insert(deals).values(sundayDeals);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateDeals();
