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
}

// Map GG API product to the format the UI expects
export function mapProduct(p: any): GGProduct {
  return {
    id: p.id,
    name: p.name || p.item_name || '',
    price: parseFloat(p.sale > 0 ? p.sale : p.price) || 0,
    sale: parseFloat(p.sale) || 0,
    image: p.photo_url || p.HighResPhotoUrl || p.image || `https://cdn.gardengrocer.com/images/products/${p.id}.jpg`,
    is_liquor: !!p.is_liquor,
    taxable: !!p.taxable,
    unavailable: !!p.unavailable,
    category_name: p.category_name || '',
    aisle_name: p.aisle_name || '',
    brand: p.brand || p.manufacturer || '',
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<GGCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getCategories()
      .then(res => {
        const cats = (res.data || res || []).map((c: any) => ({
          id: c.id,
          name: c.name || c.aisle_name || '',
          image: c.image || c.photo_url || '',
          product_count: c.product_count || 0,
        }));
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
        const prods = (res.data || res || []).map(mapProduct);
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
      const prods = (res.data || res || []).map(mapProduct);
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
        const prods = (res.data || res || []).map(mapProduct);
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
        const prods = (res.data || res || []).map(mapProduct);
        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
