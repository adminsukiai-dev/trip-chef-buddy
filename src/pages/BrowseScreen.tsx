import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Wine } from 'lucide-react';
import { CATEGORIES, PRODUCTS, BEVERAGE_SUBCATEGORIES, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { useUserDietaryProfile } from '@/hooks/useUserDietaryProfile';
import { useFavorites } from '@/hooks/useFavorites';

const FILTERS = ['All', 'Organic', 'Gluten-Free', 'Vegan', 'Kid-Friendly', 'Popular'];

const BrowseScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBevSub, setSelectedBevSub] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const { allergens, familyAllergens, dietaryPreferences } = useUserDietaryProfile();
  const allAllergens = [...new Set([...allergens, ...familyAllergens])];

  const handleCategoryClick = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if ((cat as any)?.requiresAgeVerification && !ageVerified) {
      setPendingCategory(catId);
      setShowAgeModal(true);
      return;
    }
    setSelectedCategory(catId);
    setSelectedBevSub(null);
  };

  const handleAgeVerified = () => {
    setAgeVerified(true);
    setShowAgeModal(false);
    if (pendingCategory) {
      setSelectedCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  const handleAgeDeclined = () => {
    setShowAgeModal(false);
    setPendingCategory(null);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedCategory === 'beverages' && selectedBevSub && p.subcategory !== selectedBevSub) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === 'Organic') return p.dietary.includes('organic');
    if (activeFilter === 'Gluten-Free') return p.dietary.includes('gluten-free');
    if (activeFilter === 'Vegan') return p.dietary.includes('vegan');
    if (activeFilter === 'Popular') return p.popular;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AgeVerificationModal open={showAgeModal} onVerified={handleAgeVerified} onDeclined={handleAgeDeclined} />

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

        {/* Categories Grid */}
        {!selectedCategory && (
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="relative h-32 rounded-2xl overflow-hidden group"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                </div>
                {(cat as any).requiresAgeVerification && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: 'rgba(212,168,67,0.9)', color: 'white' }}>
                    21+
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Products in category */}
        {selectedCategory && (
          <div className="px-4 pb-4">
            <button
              onClick={() => { setSelectedCategory(null); setSelectedBevSub(null); }}
              className="text-sm text-primary font-medium mb-3 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> All Categories
            </button>

            {/* Beverage subcategory tabs */}
            {selectedCategory === 'beverages' && (
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                <button
                  onClick={() => setSelectedBevSub(null)}
                  className={`grocer-pill whitespace-nowrap text-xs ${!selectedBevSub ? 'selected' : ''}`}
                >
                  All
                </button>
                {BEVERAGE_SUBCATEGORIES.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedBevSub(sub.id)}
                    className={`grocer-pill whitespace-nowrap text-xs ${selectedBevSub === sub.id ? 'selected' : ''}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {filteredProducts.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} compact userAllergens={allAllergens} userDietary={dietaryPreferences} />
                  {product.isAlcohol && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
                      style={{ background: 'rgba(212,168,67,0.15)', color: 'hsl(42, 55%, 50%)', border: '1px solid rgba(212,168,67,0.3)' }}>
                      <Wine size={10} /> 21+
                    </div>
                  )}
                </div>
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
