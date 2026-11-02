export const initialProgress = {
  currentStage: 1,
  completedStages: [],
  stars: 0,
  coins: 250,
};

export const GAME_STAGES = [
  {
    id: "pretoria",
    name: "Pretoria",
    shortLabel: "PRETORIA",
    order: 1,
    positionClass: "city-center",
    title: "The Journey Begins",
    score: 1,
    description:
      "Pretoria is the gateway to your South African route. Discover the city and unlock the next stop.",
    challenge: {
      question: "Which city are you currently exploring?",
      choices: ["Pretoria", "Kimberley", "De Aar"],
      answer: "Pretoria",
      reward: 3,
    },
  },
  {
    id: "kimberley",
    name: "Kimberley",
    shortLabel: "KIMBERLEY",
    order: 2,
    positionClass: "stop-kimberley",
    title: "Diamond City",
    score: 2,
    description:
      "Kimberley is rich in mining history and resilience. Learn the story behind the city before the train moves on.",
    challenge: {
      question: "Which city is famous for the diamond rush?",
      choices: ["Kimberley", "Bellville", "Worcester"],
      answer: "Kimberley",
      reward: 3,
    },
  },
  {
    id: "beaufort-west",
    name: "Beaufort West",
    shortLabel: "BEAUFORT WEST",
    order: 3,
    positionClass: "stop-beaufort-west",
    title: "The Karoo Stop",
    score: 6,
    description:
      "Beaufort West sits on the edge of the Karoo, where travellers have rested for generations.",
    challenge: {
      question: "Which region is Beaufort West known for?",
      choices: ["Karoo", "Garden Route", "Highveld"],
      answer: "Karoo",
      reward: 4,
    },
  },
  {
    id: "de-aar",
    name: "De Aar",
    shortLabel: "DE AAR",
    order: 4,
    positionClass: "stop-de-aar",
    title: "Railway Crossroads",
    score: 6,
    description:
      "De Aar is a key rail junction, serving travellers and freight across the country.",
    challenge: {
      question: "Why is De Aar important to the rail network?",
      choices: ["It is a major junction", "It is on the coast", "It is the capital"],
      answer: "It is a major junction",
      reward: 4,
    },
  },
  {
    id: "worcester",
    name: "Worcester",
    shortLabel: "WORCESTER",
    order: 5,
    positionClass: "stop-worcester",
    title: "Fruit and Valley",
    score: 5,
    description:
      "Worcester is known for its orchards, farming heritage, and the beauty of the valley.",
    challenge: {
      question: "What is Worcester best known for?",
      choices: ["Fruit farming", "Gold mining", "Forest city"],
      answer: "Fruit farming",
      reward: 3,
    },
  },
  {
    id: "bellville",
    name: "Bellville",
    shortLabel: "BELLVILLE",
    order: 6,
    positionClass: "stop-bellville",
    title: "Gateway to the Cape",
    score: 7,
    description:
      "Bellville is a busy Cape Town gateway with strong community and transport links.",
    challenge: {
      question: "What role does Bellville play for Cape Town?",
      choices: ["Transport gateway", "Mining town", "Desert outpost"],
      answer: "Transport gateway",
      reward: 2,
    },
  },
  {
    id: "wellington",
    name: "Wellington",
    shortLabel: "WELLINGTON",
    order: 7,
    positionClass: "stop-wellington",
    title: "The Wine Valley",
    score: 6,
    description:
      "Wellington is loved for its wine heritage and scenic countryside.",
    challenge: {
      question: "What is Wellington especially associated with?",
      choices: ["Wine country", "Coal mining", "Desert dunes"],
      answer: "Wine country",
      reward: 2,
    },
  },
  {
    id: "cape-town",
    name: "Cape Town",
    shortLabel: "CAPE TOWN",
    order: 8,
    positionClass: "stop-cape-town",
    title: "Final Destination",
    score: 8,
    description:
      "Cape Town closes the loop with iconic scenery, culture, and a unforgettable finish to the journey.",
    challenge: {
      question: "Which city is famous for Table Mountain?",
      choices: ["Cape Town", "Pretoria", "Kimberley"],
      answer: "Cape Town",
      reward: 5,
    },
  },
];
