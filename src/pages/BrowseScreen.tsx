import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Wine, Loader2 } from 'lucide-react';
import { useCategories, useCategoryProducts, useProductSearch, useBestSellers, GGProduct } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useCartStore } from '@/store/cartStore';

const FILTERS = ['All', 'Favorites', 'Best Sellers', 'Deals', 'Popular'];

const BrowseScreen = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const { categories, loading: catsLoading } = useCategories();
  const { products: categoryProducts, loading: prodsLoading } = useCategoryProducts(selectedCategoryId);
  const { results: searchResults, loading: searchLoading, search: doSearch } = useProductSearch();
  const { products: bestSellers, loading: bestLoading } = useBestSellers();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (searchDebounce.length >= 2) {
      doSearch(searchDebounce);
    }
  }, [searchDebounce, doSearch]);

  const handleCategoryClick = (catId: number, catName: string) => {
    const isAlcohol = catName.toLowerCase().includes('alcohol') || catName.toLowerCase().includes('wine') || catName.toLowerCase().includes('beer') || catName.toLowerCase().includes('liquor');
    if (isAlcohol && !ageVerified) {
      setShowAgeModal(true);
      return;
    }
    setSelectedCategoryId(catId);
  };

  const handleAgeVerified = () => {
    setAgeVerified(true);
    setShowAgeModal(false);
  };

  const handleAgeDeclined = () => {
    setShowAgeModal(false);
  };

  // Convert GG product to format ProductCard expects
  const toCardProduct = (p: GGProduct) => ({
    id: String(p.id),
    name: p.name,
    brand: p.brand || '',
    price: p.price,
    image: p.image,
    category: p.category_name || '',
    subcategory: '',
    dietary: [] as string[],
    popular: false,
    isAlcohol: p.is_liquor,
  });

  const displayProducts = search.length >= 2 ? searchResults : (selectedCategoryId ? categoryProducts : bestSellers);
  const isLoading = search.length >= 2 ? searchLoading : (selectedCategoryId ? prodsLoading : bestLoading);

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
        {/* Categories Grid */}
        {!selectedCategoryId && search.length < 2 && (
          <div className="px-4 pb-4">
            {catsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleCategoryClick(cat.id, cat.name)}
                    className="relative h-28 rounded-2xl overflow-hidden group bg-primary/5"
                  >
                    {cat.image && (
                      <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-sm font-semibold text-white">{cat.name}</p>
                      {cat.product_count ? (
                        <p className="text-[10px] text-white/60">{cat.product_count} items</p>
                      ) : null}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products in category or search results */}
        {(selectedCategoryId || search.length >= 2) && (
          <div className="px-4 pb-4">
            {selectedCategoryId && (
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="text-sm text-primary font-medium mb-3 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> All Categories
              </button>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : (
              <div className="space-y-3">
                {displayProducts.map(product => (
                  <div key={product.id} className="relative">
                    <ProductCard
                      product={toCardProduct(product)}
                      compact
                      showFavorite
                      isFavorite={isFavorite(String(product.id))}
                      onToggleFavorite={toggleFavorite}
                    />
                    {product.is_liquor && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
                        style={{ background: 'rgba(212,168,67,0.15)', color: 'hsl(42, 55%, 50%)', border: '1px solid rgba(212,168,67,0.3)' }}>
                        <Wine size={10} /> 21+
                      </div>
                    )}
                  </div>
                ))}
                {displayProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No products found</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Best sellers when no category selected and no search */}
        {!selectedCategoryId && search.length < 2 && bestSellers.length > 0 && (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-display font-bold mb-3">Best Sellers</h2>
            <div className="space-y-3">
              {bestSellers.slice(0, 10).map(product => (
                <ProductCard
                  key={product.id}
                  product={toCardProduct(product)}
                  compact
                  showFavorite
                  isFavorite={isFavorite(String(product.id))}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseScreen;
