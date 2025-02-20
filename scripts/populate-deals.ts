import { db } from "../db/db";
import { deals } from "../db/schema";

async function populateDeals() {
  try {
    // Every day deals
    await db.insert(deals).values([
      {
        title: "varsity vibe 30% tygers milk",
        description: "30% off at Tygers Milk",
        location: "Tygers Milk",
        category: "Food",
        timeWindow: "before 4pm",
        day: "Every day",
        price: null,
      },
      {
        title: "Vida cafe 20% varsity vibe",
        description: "20% off at Vida Cafe with varsity vibe",
        location: "Vida Cafe",
        category: "Food",
        day: "Every day",
        price: null,
      },
      {
        title: "Den Anker V&A waterfront breakfast special and mimosa",
        description: "Breakfast special and mimosa R120",
        location: "Den Anker, V&A Waterfront",
        category: "Food",
        price: "120",
        timeWindow: "until 11am",
        day: "Every day",
      },
      {
        title: "Grand Pavilion Sea-point sushi and cocktails",
        description: "Half price cocktails and sushi",
        location: "Grand Pavilion, Sea Point",
        category: "Food",
        timeWindow: "12pm to 5pm",
        day: "Every day",
        price: null,
      },
      {
        title: "Rockefeller Monday-Thursday special",
        description: "2 for one pizza and cocktail",
        location: "Rockefeller",
        category: "Food",
        timeWindow: "5pm to 7pm",
        day: "Every day",
        price: null,
      },
      {
        title: "Cafe caprice happy hour",
        description: "Happy hour at Camps Bay",
        location: "Cafe Caprice, Camps Bay",
        category: "Food",
        timeWindow: "4pm-6pm",
        day: "Every day",
        price: null,
      },
    ]);

    // Monday deals
    await db.insert(deals).values([
      {
        title: "turn and tender burger + chips special",
        description: "R85 burger + chips special",
        location: "Turn n Tender",
        category: "Food",
        price: "85",
        day: "Monday",
      },
      {
        title: "Koffie therapy 2 for 1 breakfast",
        description: "R62 2 for 1 breakfast special",
        location: "Koffie Therapy",
        category: "Food",
        price: "62",
        timeWindow: "7-11am",
        day: "Monday",
      },
      {
        title: "Copper club half priced pizza",
        description: "Half price on all pizzas",
        location: "Copper Club",
        category: "Food",
        day: "Monday",
        price: null,
      },
      {
        title: "Bossa burger special",
        description: "Burger, chips and onions R75",
        location: "Bossa",
        category: "Food",
        price: "75",
        day: "Monday",
      },
      {
        title: "Spur cheese burger special",
        description: "R69 before 4pm, R70 after 4pm",
        location: "Spur",
        category: "Food",
        price: "69",
        day: "Monday",
      },
      {
        title: "Asami's B1G1 free noodles",
        description: "Buy 1 Get 1 free noodles chicken chow mein",
        location: "Asami's",
        category: "Food",
        day: "Monday",
        price: null,
      },
    ]);

    // Tuesday deals
    await db.insert(deals).values([
      {
        title: "Half priced burgers at Copper Club",
        description: "All burgers half price",
        location: "Copper Club",
        category: "Food",
        day: "Tuesday",
        price: null,
      },
      {
        title: "NOB two burgers special",
        description: "R170 for two burgers",
        location: "NOB",
        category: "Food",
        price: "170",
        day: "Tuesday",
      },
      {
        title: "Tigers milk pizza special",
        description: "2 pizzas for R200",
        location: "Tigers Milk",
        category: "Food",
        price: "200",
        day: "Tuesday",
      },
      {
        title: "Panarottis pizza and pasta special",
        description: "R90 pizza and pasta",
        location: "Panarottis",
        category: "Food",
        price: "90",
        day: "Tuesday",
      },
      {
        title: "Burger and lobster Cape Town special",
        description: "R199 for two burgers",
        location: "Burger and Lobster, Bree Street",
        category: "Food",
        price: "199",
        day: "Tuesday",
      },
      {
        title: "Cafe Caprice burger and cocktail special",
        description: "Two for one burger special and half price cocktails",
        location: "Cafe Caprice",
        category: "Food",
        timeWindow: "4pm to 6pm",
        day: "Tuesday",
        price: null,
      },
    ]);

    // Wednesday deals
    await db.insert(deals).values([
      {
        title: "Wacky Wednesday steers",
        description: "Wednesday steak special",
        location: "Steers",
        category: "Food",
        day: "Wednesday",
        price: null,
      },
      {
        title: "Copper Club 2 for 1",
        description: "2 burgers/pizza for R195",
        location: "Copper Club",
        category: "Food",
        price: "195",
        day: "Wednesday",
      },
      {
        title: "Half priced cocktails",
        description: "All cocktails half price",
        location: "Copper Club",
        category: "Food",
        day: "Wednesday",
        price: null,
      },
      {
        title: "Tortilla 2 For one burritos",
        description: "Buy one get one free burritos",
        location: "Tortilla",
        category: "Food",
        day: "Wednesday",
        price: null,
      },
    ]);

    // Thursday deals
    await db.insert(deals).values([
      {
        title: "Copper Club chicken schnitzel",
        description: "Chicken schnitzel special R120",
        location: "Copper Club",
        category: "Food",
        price: "120",
        day: "Thursday",
      },
    ]);

    // Sunday deals
    await db.insert(deals).values([
      {
        title: "Rockefeller hotel sushi buffet",
        description: "Sushi buffet for R229 pp",
        location: "Rockefeller Hotel",
        category: "Food",
        price: "229",
        day: "Sunday",
      },
    ]);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateDeals();
