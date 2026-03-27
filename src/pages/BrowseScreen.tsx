import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const FILTERS = ['All', 'Organic', 'Gluten-Free', 'Vegan', 'Kid-Friendly', 'Popular'];

const BrowseScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === 'Organic') return p.dietary.includes('organic');
    if (activeFilter === 'Gluten-Free') return p.dietary.includes('gluten-free');
    if (activeFilter === 'Vegan') return p.dietary.includes('vegan');
    if (activeFilter === 'Popular') return p.popular;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-display font-bold mb-3">Browse Products</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search 8,000+ products..."
            className="w-full bg-muted rounded-full pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Filters */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`grocer-pill whitespace-nowrap ${activeFilter === f ? 'selected' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Categories */}
        {!selectedCategory && (
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedCategory(cat.id)}
                className="relative h-32 rounded-2xl overflow-hidden group"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Products in category */}
        {selectedCategory && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-primary font-medium mb-3 flex items-center gap-1"
            >
              ← All Categories
            </button>
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} compact />
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No products found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseScreen;
