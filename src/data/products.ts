export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  dietary: string[];
  popular: boolean;
  description?: string;
}

export const CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🥞', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80' },
  { id: 'produce', name: 'Fresh Produce', emoji: '🥑', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
  { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' },
  { id: 'frozen', name: 'Frozen', emoji: '🧊', image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?w=400&q=80' },
  { id: 'pantry', name: 'Pantry', emoji: '🫙', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80' },
  { id: 'baby', name: 'Baby & Kids', emoji: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80' },
  { id: 'household', name: 'Household', emoji: '🧴', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80' },
  { id: 'beer-wine', name: 'Beer & Wine', emoji: '🍷', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
  { id: 'deli', name: 'Deli', emoji: '🥪', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80' },
];

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Whole Milk', brand: 'Horizon Organic', price: 5.49, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', category: 'dairy', subcategory: 'milk', dietary: ['organic'], popular: true },
  { id: '2', name: '2% Reduced Fat Milk', brand: 'Fairlife', price: 4.99, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category: 'dairy', subcategory: 'milk', dietary: [], popular: true },
  { id: '3', name: 'Large Eggs (12ct)', brand: 'Eggland\'s Best', price: 4.29, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80', category: 'dairy', subcategory: 'eggs', dietary: [], popular: true },
  { id: '4', name: 'Strawberries (1lb)', brand: 'Driscoll\'s', price: 4.99, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['organic'], popular: true },
  { id: '5', name: 'Bananas (bunch)', brand: 'Dole', price: 1.29, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: [], popular: true },
  { id: '6', name: 'Dasani Water 24-Pack', brand: 'Dasani', price: 4.99, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80', category: 'drinks', subcategory: 'water', dietary: [], popular: true },
  { id: '7', name: 'Goldfish Crackers', brand: 'Pepperidge Farm', price: 3.49, image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&q=80', category: 'snacks', subcategory: 'crackers', dietary: [], popular: true },
  { id: '8', name: 'Greek Yogurt (32oz)', brand: 'Chobani', price: 5.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', category: 'dairy', subcategory: 'yogurt', dietary: ['gluten-free'], popular: true },
  { id: '9', name: 'Sourdough Bread', brand: 'San Francisco', price: 4.49, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=300&q=80', category: 'pantry', subcategory: 'bread', dietary: [], popular: true },
  { id: '10', name: 'Sunscreen SPF 50', brand: 'Banana Boat', price: 9.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80', category: 'household', subcategory: 'suncare', dietary: [], popular: true },
  { id: '11', name: 'Cheerios (18oz)', brand: 'General Mills', price: 4.79, image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&q=80', category: 'breakfast', subcategory: 'cereal', dietary: ['gluten-free'], popular: true },
  { id: '12', name: 'Almond Milk', brand: 'Califia Farms', price: 4.49, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=300&q=80', category: 'dairy', subcategory: 'milk', dietary: ['dairy-free', 'vegan'], popular: false },
  { id: '13', name: 'Trail Mix', brand: 'Planters', price: 6.49, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&q=80', category: 'snacks', subcategory: 'nuts', dietary: ['gluten-free'], popular: true },
  { id: '14', name: 'Cabernet Sauvignon', brand: 'Josh Cellars', price: 12.99, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80', category: 'beer-wine', subcategory: 'wine', dietary: [], popular: true },
  { id: '15', name: 'Chicken Breast (2lb)', brand: 'Perdue', price: 8.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=300&q=80', category: 'meat', subcategory: 'chicken', dietary: [], popular: true },
  { id: '16', name: 'Frozen Pizza', brand: 'DiGiorno', price: 6.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80', category: 'frozen', subcategory: 'meals', dietary: [], popular: true },
  { id: '17', name: 'Baby Wipes (80ct)', brand: 'Pampers', price: 3.99, image: 'https://images.unsplash.com/photo-1584839404-4e96ad05e5a6?w=300&q=80', category: 'baby', subcategory: 'wipes', dietary: [], popular: false },
  { id: '18', name: 'Avocados (4ct)', brand: 'Fresh', price: 3.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['vegan'], popular: true },
  { id: '19', name: 'Orange Juice (52oz)', brand: 'Tropicana', price: 4.49, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80', category: 'drinks', subcategory: 'juice', dietary: [], popular: true },
  { id: '20', name: 'Peanut Butter', brand: 'Jif', price: 3.79, image: 'https://images.unsplash.com/photo-1643647706403-a61e1261c404?w=300&q=80', category: 'pantry', subcategory: 'spreads', dietary: ['gluten-free'], popular: true },
];

export const ORLANDO_RESORTS = [
  // Disney Resorts
  "Animal Kingdom Lodge", "Art of Animation Resort", "Bay Lake Tower", "Beach Club Resort",
  "BoardWalk Inn", "Caribbean Beach Resort", "Contemporary Resort", "Coronado Springs Resort",
  "Fort Wilderness Resort", "Grand Floridian Resort", "Old Key West Resort",
  "Polynesian Village Resort", "Pop Century Resort", "Port Orleans - French Quarter",
  "Port Orleans - Riverside", "Riviera Resort", "Saratoga Springs Resort",
  "Wilderness Lodge", "Yacht Club Resort", "All-Star Movies Resort", "All-Star Music Resort",
  "All-Star Sports Resort",
  // Universal Resorts
  "Cabana Bay Beach Resort", "Aventura Hotel", "Royal Pacific Resort",
  "Hard Rock Hotel Orlando", "Portofino Bay Hotel", "Sapphire Falls Resort",
  "Endless Summer Resort - Surfside", "Endless Summer Resort - Dockside",
  // Other
  "Bonnet Creek Resort", "Hilton Orlando", "Marriott World Center",
  "Vacation Rental / Airbnb", "Other address"
];
