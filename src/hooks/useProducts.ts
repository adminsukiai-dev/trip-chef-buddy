import { useState, useEffect, useCallback } from 'react';
import { products as productsApi } from '@/lib/api';

export interface GGProduct {
  id: number;
  name: string;
  price: number;
  sale: number;
  image: string;
  is_liquor: boolean;
  taxable: boolean;
  unavailable: boolean;
  category_name?: string;
  aisle_name?: string;
  brand?: string;
}

export interface GGCategory {
  id: number;
  name: string;
  image?: string;
  product_count?: number;
  categories?: { id: number; name: string; count: number }[];
}

// Map GG API product (nested attributes format) to flat format
export function mapProduct(p: any): GGProduct {
  // Handle both flat and nested {id, attributes: {...}} format
  const attrs = p.attributes || p;
  return {
    id: p.id || attrs.id,
    name: attrs.name || attrs.item_name || p.name || '',
    price: parseFloat(attrs.sale > 0 ? attrs.sale : (attrs.price || p.price)) || 0,
    sale: parseFloat(attrs.sale || p.sale) || 0,
    image: attrs.imageHighRes || attrs.imageBig || attrs.imageMedium || attrs.imageSmall
      || p.imageHighRes || p.imageBig || p.photo_url || p.HighResPhotoUrl
      || `https://cdn.gardengrocer.com/attachments/photos/med/${p.id}.jpeg`,
    is_liquor: !!(attrs.alcohol || attrs.is_liquor || p.is_liquor),
    taxable: !!(attrs.taxable || p.taxable),
    unavailable: !!(attrs.unavailable || p.unavailable),
    category_name: attrs.category_name || p.category_name || '',
    aisle_name: attrs.aisle_name || p.aisle_name || '',
    brand: attrs.brand_name || attrs.brand || p.manufacturer || '',
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<GGCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getCategories()
      .then(res => {
        // API returns: [{type: "aisle", id, attributes: {name, imageUrl, categories: [...]}}]
        const raw = res.data || res || [];
        const cats: GGCategory[] = raw.map((c: any) => {
          const attrs = c.attributes || c;
          const subcats = (attrs.categories || []).map((sc: any) => ({
            id: sc.id,
            name: sc.attributes?.name || sc.name || '',
            count: sc.attributes?.count || sc.count || 0,
          }));
          const totalCount = subcats.reduce((sum: number, s: any) => sum + (s.count || 0), 0);
          return {
            id: c.id,
            name: attrs.name || '',
            image: attrs.imageUrl || attrs.image || '',
            product_count: totalCount,
            categories: subcats,
          };
        });
        setCategories(cats);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export function useCategoryProducts(categoryId: number | null) {
  const [products, setProducts] = useState<GGProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    productsApi.getCategoryProducts(categoryId)
      .then(res => {
        const raw = res.data || res || [];
        const prods = raw.map(mapProduct);
        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { products, loading };
}

export function useProductSearch() {
  const [results, setResults] = useState<GGProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await productsApi.search(query);
      const raw = res.data || res || [];
      const prods = raw.map(mapProduct);
      setResults(prods);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

export function useBestSellers() {
  const [products, setProducts] = useState<GGProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getBestSellers()
      .then(res => {
        const raw = res.data || res || [];
        const prods = raw.map(mapProduct);
        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useDeals() {
  const [products, setProducts] = useState<GGProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getDeals()
      .then(res => {
        const raw = res.data || res || [];
        const prods = raw.map(mapProduct);
        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
