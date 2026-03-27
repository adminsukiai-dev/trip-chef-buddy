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
  isAlcohol?: boolean;
}

export const CATEGORIES = [
  { id: 'produce', name: 'Fresh Produce', emoji: '🥑', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80' },
  { id: 'bakery', name: 'Bakery', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { id: 'snacks', name: 'Snacks & Chips', emoji: '🍿', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
  { id: 'frozen', name: 'Frozen Foods', emoji: '🧊', image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?w=400&q=80' },
  { id: 'deli', name: 'Deli & Prepared', emoji: '🥪', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80' },
  { id: 'meat', name: 'Meat & Seafood', emoji: '🥩', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' },
  { id: 'breakfast', name: 'Breakfast Foods', emoji: '🥞', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80' },
  { id: 'pasta', name: 'Pasta & Grains', emoji: '🍝', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80' },
  { id: 'condiments', name: 'Condiments & Spices', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
  { id: 'soups', name: 'Soups & Canned', emoji: '🥫', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80' },
  { id: 'household', name: 'Household', emoji: '🧴', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80' },
  { id: 'health', name: 'Health & Beauty', emoji: '💊', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: 'baby', name: 'Baby & Kids', emoji: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80' },
  { id: 'park', name: 'Park Essentials', emoji: '🏰', image: 'https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?w=400&q=80' },
  { id: 'alcohol', name: 'Wine, Beer & Spirits', emoji: '🍷', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80', requiresAgeVerification: true },
];

export const BEVERAGE_SUBCATEGORIES = [
  { id: 'water', name: 'Water' },
  { id: 'juice', name: 'Juice' },
  { id: 'soda', name: 'Soda' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea' },
  { id: 'sports', name: 'Sports Drinks' },
  { id: 'milk-alt', name: 'Milk Alternatives' },
];

export const PRODUCTS: Product[] = [
  // Fresh Produce
  { id: 'p1', name: 'Strawberries (1lb)', brand: "Driscoll's", price: 4.99, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['organic'], popular: true },
  { id: 'p2', name: 'Bananas (bunch)', brand: 'Dole', price: 1.29, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: [], popular: true },
  { id: 'p3', name: 'Avocados (4ct)', brand: 'Fresh', price: 3.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['vegan'], popular: true },
  { id: 'p4', name: 'Baby Spinach (5oz)', brand: 'Organic Girl', price: 3.49, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80', category: 'produce', subcategory: 'greens', dietary: ['organic', 'vegan'], popular: false },
  { id: 'p5', name: 'Blueberries (6oz)', brand: "Driscoll's", price: 3.99, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['organic'], popular: true },
  { id: 'p6', name: 'Grape Tomatoes (1pt)', brand: 'NatureSweet', price: 3.49, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80', category: 'produce', subcategory: 'vegetable', dietary: ['vegan'], popular: false },
  { id: 'p7', name: 'Watermelon (seedless)', brand: 'Fresh', price: 6.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80', category: 'produce', subcategory: 'fruit', dietary: ['vegan'], popular: true },

  // Dairy & Eggs
  { id: 'd1', name: 'Whole Milk', brand: 'Horizon Organic', price: 5.49, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', category: 'dairy', subcategory: 'milk', dietary: ['organic'], popular: true },
  { id: 'd2', name: '2% Reduced Fat Milk', brand: 'Fairlife', price: 4.99, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category: 'dairy', subcategory: 'milk', dietary: [], popular: true },
  { id: 'd3', name: 'Large Eggs (12ct)', brand: "Eggland's Best", price: 4.29, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80', category: 'dairy', subcategory: 'eggs', dietary: [], popular: true },
  { id: 'd4', name: 'Greek Yogurt (32oz)', brand: 'Chobani', price: 5.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', category: 'dairy', subcategory: 'yogurt', dietary: ['gluten-free'], popular: true },
  { id: 'd5', name: 'Butter (1lb)', brand: 'Kerrygold', price: 5.49, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80', category: 'dairy', subcategory: 'butter', dietary: ['gluten-free'], popular: false },
  { id: 'd6', name: 'Shredded Cheddar (8oz)', brand: 'Tillamook', price: 3.99, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300&q=80', category: 'dairy', subcategory: 'cheese', dietary: ['gluten-free'], popular: false },
  { id: 'd7', name: 'Cream Cheese (8oz)', brand: 'Philadelphia', price: 3.49, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80', category: 'dairy', subcategory: 'cheese', dietary: ['gluten-free'], popular: false },

  // Bakery
  { id: 'b1', name: 'Sourdough Bread', brand: 'San Francisco', price: 4.49, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=300&q=80', category: 'bakery', subcategory: 'bread', dietary: [], popular: true },
  { id: 'b2', name: 'Bagels (6ct)', brand: "Thomas'", price: 3.99, image: 'https://images.unsplash.com/photo-1585535065945-fceb0a022b1c?w=300&q=80', category: 'bakery', subcategory: 'bread', dietary: [], popular: true },
  { id: 'b3', name: 'Croissants (4ct)', brand: 'La Boulangerie', price: 4.49, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&q=80', category: 'bakery', subcategory: 'pastry', dietary: [], popular: true },
  { id: 'b4', name: 'Tortillas (10ct)', brand: 'Mission', price: 2.99, image: 'https://images.unsplash.com/photo-1622285856027-ad2e695a1929?w=300&q=80', category: 'bakery', subcategory: 'wraps', dietary: ['vegan'], popular: false },

  // Snacks & Chips
  { id: 's1', name: 'Goldfish Crackers', brand: 'Pepperidge Farm', price: 3.49, image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&q=80', category: 'snacks', subcategory: 'crackers', dietary: [], popular: true },
  { id: 's2', name: 'Trail Mix', brand: 'Planters', price: 6.49, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&q=80', category: 'snacks', subcategory: 'nuts', dietary: ['gluten-free'], popular: true },
  { id: 's3', name: 'Tortilla Chips', brand: 'Tostitos', price: 4.29, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=300&q=80', category: 'snacks', subcategory: 'chips', dietary: ['gluten-free'], popular: true },
  { id: 's4', name: 'Fruit Snacks (10ct)', brand: 'Annie\'s Organic', price: 3.99, image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300&q=80', category: 'snacks', subcategory: 'fruit-snacks', dietary: ['organic', 'gluten-free'], popular: true },
  { id: 's5', name: 'Pretzels', brand: 'Snyder\'s', price: 3.49, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&q=80', category: 'snacks', subcategory: 'pretzels', dietary: ['vegan'], popular: false },
  { id: 's6', name: 'Hummus (10oz)', brand: 'Sabra', price: 4.49, image: 'https://images.unsplash.com/photo-1637361973-1d60d4f3b3b4?w=300&q=80', category: 'snacks', subcategory: 'dips', dietary: ['vegan', 'gluten-free'], popular: true },

  // Beverages
  { id: 'bv1', name: 'Dasani Water 24-Pack', brand: 'Dasani', price: 4.99, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80', category: 'beverages', subcategory: 'water', dietary: [], popular: true },
  { id: 'bv2', name: 'Orange Juice (52oz)', brand: 'Tropicana', price: 4.49, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80', category: 'beverages', subcategory: 'juice', dietary: [], popular: true },
  { id: 'bv3', name: 'Apple Juice (64oz)', brand: 'Martinelli\'s', price: 3.99, image: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=300&q=80', category: 'beverages', subcategory: 'juice', dietary: [], popular: false },
  { id: 'bv4', name: 'Coca-Cola 12-Pack', brand: 'Coca-Cola', price: 6.99, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=80', category: 'beverages', subcategory: 'soda', dietary: [], popular: true },
  { id: 'bv5', name: 'LaCroix Sparkling (12pk)', brand: 'LaCroix', price: 5.49, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80', category: 'beverages', subcategory: 'water', dietary: [], popular: true },
  { id: 'bv6', name: 'Starbucks Cold Brew', brand: 'Starbucks', price: 4.99, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80', category: 'beverages', subcategory: 'coffee', dietary: [], popular: true },
  { id: 'bv7', name: 'Green Tea (20ct)', brand: 'Tazo', price: 4.29, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80', category: 'beverages', subcategory: 'tea', dietary: ['vegan'], popular: false },
  { id: 'bv8', name: 'Gatorade 8-Pack', brand: 'Gatorade', price: 7.99, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&q=80', category: 'beverages', subcategory: 'sports', dietary: ['gluten-free'], popular: true },
  { id: 'bv9', name: 'Oat Milk', brand: 'Oatly', price: 4.99, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=300&q=80', category: 'beverages', subcategory: 'milk-alt', dietary: ['dairy-free', 'vegan'], popular: true },
  { id: 'bv10', name: 'Almond Milk', brand: 'Califia Farms', price: 4.49, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=300&q=80', category: 'beverages', subcategory: 'milk-alt', dietary: ['dairy-free', 'vegan'], popular: false },

  // Frozen Foods
  { id: 'f1', name: 'Frozen Pizza', brand: 'DiGiorno', price: 6.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80', category: 'frozen', subcategory: 'meals', dietary: [], popular: true },
  { id: 'f2', name: 'Ice Cream (pint)', brand: 'Ben & Jerry\'s', price: 5.49, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&q=80', category: 'frozen', subcategory: 'dessert', dietary: ['gluten-free'], popular: true },
  { id: 'f3', name: 'Frozen Fruit Bars (6ct)', brand: 'Outshine', price: 4.99, image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&q=80', category: 'frozen', subcategory: 'dessert', dietary: ['gluten-free', 'vegan'], popular: true },
  { id: 'f4', name: 'Chicken Nuggets (2lb)', brand: 'Tyson', price: 7.99, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&q=80', category: 'frozen', subcategory: 'meals', dietary: [], popular: true },
  { id: 'f5', name: 'Frozen Waffles (10ct)', brand: 'Eggo', price: 3.49, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&q=80', category: 'frozen', subcategory: 'breakfast', dietary: [], popular: false },

  // Deli & Prepared
  { id: 'dl1', name: 'Rotisserie Chicken', brand: 'Store Made', price: 7.99, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&q=80', category: 'deli', subcategory: 'prepared', dietary: ['gluten-free'], popular: true },
  { id: 'dl2', name: 'Turkey Breast (1lb)', brand: 'Boar\'s Head', price: 9.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80', category: 'deli', subcategory: 'sliced', dietary: ['gluten-free'], popular: true },
  { id: 'dl3', name: 'Caesar Salad Kit', brand: 'Taylor Farms', price: 4.49, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80', category: 'deli', subcategory: 'salad', dietary: [], popular: true },
  { id: 'dl4', name: 'Pasta Salad (1lb)', brand: 'Store Made', price: 5.99, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&q=80', category: 'deli', subcategory: 'salad', dietary: [], popular: false },

  // Meat & Seafood
  { id: 'm1', name: 'Chicken Breast (2lb)', brand: 'Perdue', price: 8.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=300&q=80', category: 'meat', subcategory: 'chicken', dietary: [], popular: true },
  { id: 'm2', name: 'Ground Beef 80/20 (1lb)', brand: 'Angus', price: 6.99, image: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=300&q=80', category: 'meat', subcategory: 'beef', dietary: [], popular: true },
  { id: 'm3', name: 'Atlantic Salmon (1lb)', brand: 'Fresh Catch', price: 11.99, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=300&q=80', category: 'meat', subcategory: 'seafood', dietary: ['gluten-free'], popular: true },
  { id: 'm4', name: 'Shrimp (1lb)', brand: 'Wild Caught', price: 10.99, image: 'https://images.unsplash.com/photo-1565680018093-ebb6e3066e7d?w=300&q=80', category: 'meat', subcategory: 'seafood', dietary: ['gluten-free'], popular: true },
  { id: 'm5', name: 'Bacon (16oz)', brand: 'Oscar Mayer', price: 6.49, image: 'https://images.unsplash.com/photo-1606851094655-b3b5a526d4f3?w=300&q=80', category: 'meat', subcategory: 'pork', dietary: ['gluten-free'], popular: true },

  // Breakfast Foods
  { id: 'bf1', name: 'Cheerios (18oz)', brand: 'General Mills', price: 4.79, image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=300&q=80', category: 'breakfast', subcategory: 'cereal', dietary: ['gluten-free'], popular: true },
  { id: 'bf2', name: 'Pancake Mix', brand: 'Kodiak Cakes', price: 4.99, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&q=80', category: 'breakfast', subcategory: 'mix', dietary: [], popular: true },
  { id: 'bf3', name: 'Maple Syrup (12oz)', brand: 'Vermont Maid', price: 5.99, image: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=300&q=80', category: 'breakfast', subcategory: 'syrup', dietary: ['vegan', 'gluten-free'], popular: false },
  { id: 'bf4', name: 'Granola Bars (6ct)', brand: 'KIND', price: 4.49, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'breakfast', subcategory: 'bars', dietary: ['gluten-free'], popular: true },
  { id: 'bf5', name: 'Instant Oatmeal (10ct)', brand: 'Quaker', price: 3.99, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=300&q=80', category: 'breakfast', subcategory: 'oatmeal', dietary: [], popular: false },

  // Pasta & Grains
  { id: 'pg1', name: 'Spaghetti (1lb)', brand: 'Barilla', price: 1.79, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=80', category: 'pasta', subcategory: 'pasta', dietary: ['vegan'], popular: true },
  { id: 'pg2', name: 'Penne Rigate', brand: 'De Cecco', price: 2.49, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=80', category: 'pasta', subcategory: 'pasta', dietary: ['vegan'], popular: false },
  { id: 'pg3', name: 'Jasmine Rice (2lb)', brand: 'Mahatma', price: 3.49, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', category: 'pasta', subcategory: 'rice', dietary: ['vegan', 'gluten-free'], popular: true },
  { id: 'pg4', name: 'Mac & Cheese (3pk)', brand: 'Kraft', price: 3.99, image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=300&q=80', category: 'pasta', subcategory: 'prepared', dietary: [], popular: true },

  // Condiments, Sauces & Spices
  { id: 'c1', name: 'Marinara Sauce', brand: "Rao's", price: 7.99, image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&q=80', category: 'condiments', subcategory: 'sauce', dietary: ['vegan', 'gluten-free'], popular: true },
  { id: 'c2', name: 'Ketchup (20oz)', brand: 'Heinz', price: 3.49, image: 'https://images.unsplash.com/photo-1594398028800-0de2b1ed0fbd?w=300&q=80', category: 'condiments', subcategory: 'condiment', dietary: ['vegan', 'gluten-free'], popular: true },
  { id: 'c3', name: 'Olive Oil (16oz)', brand: 'California Olive Ranch', price: 8.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', category: 'condiments', subcategory: 'oil', dietary: ['vegan', 'gluten-free'], popular: true },
  { id: 'c4', name: 'Peanut Butter', brand: 'Jif', price: 3.79, image: 'https://images.unsplash.com/photo-1643647706403-a61e1261c404?w=300&q=80', category: 'condiments', subcategory: 'spread', dietary: ['gluten-free'], popular: true },
  { id: 'c5', name: 'Ranch Dressing', brand: 'Hidden Valley', price: 3.49, image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&q=80', category: 'condiments', subcategory: 'dressing', dietary: ['gluten-free'], popular: false },

  // Soups & Canned
  { id: 'sp1', name: 'Chicken Noodle Soup', brand: 'Campbell\'s', price: 2.49, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80', category: 'soups', subcategory: 'soup', dietary: [], popular: true },
  { id: 'sp2', name: 'Black Beans (15oz)', brand: 'Goya', price: 1.29, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80', category: 'soups', subcategory: 'canned', dietary: ['vegan', 'gluten-free'], popular: false },
  { id: 'sp3', name: 'Canned Tuna (5oz)', brand: 'Starkist', price: 1.49, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&q=80', category: 'soups', subcategory: 'canned', dietary: ['gluten-free'], popular: true },
  { id: 'sp4', name: 'Diced Tomatoes (14oz)', brand: 'Muir Glen', price: 2.29, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80', category: 'soups', subcategory: 'canned', dietary: ['organic', 'vegan', 'gluten-free'], popular: false },

  // Household
  { id: 'h1', name: 'Paper Towels (6-roll)', brand: 'Bounty', price: 11.99, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80', category: 'household', subcategory: 'paper', dietary: [], popular: true },
  { id: 'h2', name: 'Dish Soap (22oz)', brand: 'Dawn', price: 3.99, image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&q=80', category: 'household', subcategory: 'cleaning', dietary: [], popular: true },
  { id: 'h3', name: 'Trash Bags (40ct)', brand: 'Glad', price: 8.99, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80', category: 'household', subcategory: 'bags', dietary: [], popular: false },
  { id: 'h4', name: 'Aluminum Foil (75ft)', brand: 'Reynolds', price: 4.99, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80', category: 'household', subcategory: 'kitchen', dietary: [], popular: false },

  // Health & Beauty
  { id: 'hb1', name: 'Sunscreen SPF 50', brand: 'Banana Boat', price: 9.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80', category: 'health', subcategory: 'suncare', dietary: [], popular: true },
  { id: 'hb2', name: 'Ibuprofen (24ct)', brand: 'Advil', price: 5.99, image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=300&q=80', category: 'health', subcategory: 'medicine', dietary: [], popular: true },
  { id: 'hb3', name: 'Band-Aids (30ct)', brand: 'Band-Aid', price: 3.99, image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=300&q=80', category: 'health', subcategory: 'first-aid', dietary: [], popular: false },
  { id: 'hb4', name: 'Aloe Vera Gel', brand: 'Banana Boat', price: 6.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80', category: 'health', subcategory: 'skincare', dietary: [], popular: true },

  // Baby & Kids
  { id: 'bk1', name: 'Baby Wipes (80ct)', brand: 'Pampers', price: 3.99, image: 'https://images.unsplash.com/photo-1584839404-4e96ad05e5a6?w=300&q=80', category: 'baby', subcategory: 'wipes', dietary: [], popular: true },
  { id: 'bk2', name: 'Diapers Size 4 (28ct)', brand: 'Huggies', price: 12.99, image: 'https://images.unsplash.com/photo-1584839404-4e96ad05e5a6?w=300&q=80', category: 'baby', subcategory: 'diapers', dietary: [], popular: true },
  { id: 'bk3', name: 'Baby Food Pouches (4pk)', brand: 'Gerber', price: 5.49, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80', category: 'baby', subcategory: 'food', dietary: ['organic'], popular: false },
  { id: 'bk4', name: 'Kids Sunscreen SPF 70', brand: 'Coppertone', price: 10.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80', category: 'baby', subcategory: 'suncare', dietary: [], popular: true },

  // Park Essentials
  { id: 'pk1', name: 'Portable Fan (USB)', brand: 'O2Cool', price: 12.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'park', subcategory: 'comfort', dietary: [], popular: true },
  { id: 'pk2', name: 'Poncho (2-pack)', brand: 'Frogg Toggs', price: 5.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'park', subcategory: 'rain', dietary: [], popular: true },
  { id: 'pk3', name: 'Cooling Towel', brand: 'Frogg Toggs', price: 8.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'park', subcategory: 'comfort', dietary: [], popular: true },
  { id: 'pk4', name: 'Blister Pads (6ct)', brand: 'Band-Aid', price: 5.49, image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=300&q=80', category: 'park', subcategory: 'first-aid', dietary: [], popular: true },
  { id: 'pk5', name: 'Hand Sanitizer (3pk)', brand: 'Purell', price: 4.99, image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&q=80', category: 'park', subcategory: 'hygiene', dietary: [], popular: false },

  // Wine, Beer & Spirits (alcohol)
  { id: 'a1', name: 'Cabernet Sauvignon', brand: 'Josh Cellars', price: 12.99, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80', category: 'alcohol', subcategory: 'wine', dietary: [], popular: true, isAlcohol: true },
  { id: 'a2', name: 'Pinot Grigio', brand: 'Santa Margherita', price: 14.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'alcohol', subcategory: 'wine', dietary: [], popular: true, isAlcohol: true },
  { id: 'a3', name: 'Rosé (750ml)', brand: 'Whispering Angel', price: 19.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&q=80', category: 'alcohol', subcategory: 'wine', dietary: [], popular: true, isAlcohol: true },
  { id: 'a4', name: 'Champagne (750ml)', brand: 'Moët & Chandon', price: 49.99, image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=300&q=80', category: 'alcohol', subcategory: 'champagne', dietary: [], popular: true, isAlcohol: true },
  { id: 'a5', name: 'IPA 6-Pack', brand: 'Lagunitas', price: 10.99, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&q=80', category: 'alcohol', subcategory: 'beer', dietary: [], popular: true, isAlcohol: true },
  { id: 'a6', name: 'Lager 12-Pack', brand: 'Corona Extra', price: 15.99, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&q=80', category: 'alcohol', subcategory: 'beer', dietary: [], popular: true, isAlcohol: true },
  { id: 'a7', name: 'Craft Variety 12-Pack', brand: 'Blue Moon', price: 17.99, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&q=80', category: 'alcohol', subcategory: 'beer', dietary: [], popular: false, isAlcohol: true },
  { id: 'a8', name: 'Vodka (750ml)', brand: 'Tito\'s Handmade', price: 24.99, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80', category: 'alcohol', subcategory: 'spirits', dietary: ['gluten-free'], popular: true, isAlcohol: true },
  { id: 'a9', name: 'Tequila (750ml)', brand: 'Patrón Silver', price: 39.99, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80', category: 'alcohol', subcategory: 'spirits', dietary: [], popular: true, isAlcohol: true },
  { id: 'a10', name: 'White Claw 12-Pack', brand: 'White Claw', price: 16.99, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&q=80', category: 'alcohol', subcategory: 'seltzer', dietary: ['gluten-free'], popular: true, isAlcohol: true },
  { id: 'a11', name: 'Margarita Mix', brand: 'Jose Cuervo', price: 5.99, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', category: 'alcohol', subcategory: 'mixers', dietary: [], popular: false, isAlcohol: false },
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

export const DISNEY_RESORTS = [
  "Animal Kingdom Lodge", "Art of Animation Resort", "Bay Lake Tower", "Beach Club Resort",
  "BoardWalk Inn", "Caribbean Beach Resort", "Contemporary Resort", "Coronado Springs Resort",
  "Fort Wilderness Resort", "Grand Floridian Resort", "Old Key West Resort",
  "Polynesian Village Resort", "Pop Century Resort", "Port Orleans - French Quarter",
  "Port Orleans - Riverside", "Riviera Resort", "Saratoga Springs Resort",
  "Wilderness Lodge", "Yacht Club Resort", "All-Star Movies Resort", "All-Star Music Resort",
  "All-Star Sports Resort",
];

export const isDisneyResort = (resort: string) => DISNEY_RESORTS.includes(resort);
