/**
 * Garden Grocer API Client
 * Connects the Lovable frontend to the real GG backend (api2.gardengrocer.com)
 */

const API_BASE = import.meta.env.VITE_GG_API_URL || 'https://api2.gardengrocer.com/api';

let authToken: string | null = localStorage.getItem('gg_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('gg_token', token);
  } else {
    localStorage.removeItem('gg_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `API Error ${response.status}`);
  }

  return response.json();
}

// ─── Auth ───
export const auth = {
  async login(email: string, password: string) {
    const data = await request<any>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },

  async register(email: string, password: string, firstName: string, lastName: string) {
    const data = await request<any>('/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        password_confirmation: password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },

  async logout() {
    try {
      await request('/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  async getProfile() {
    return request<any>('/user/profile');
  },

  async updateProfile(data: any) {
    return request<any>('/user/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async googleLogin(token: string) {
    const data = await request<any>('/validate_google_token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },

  async appleLogin(identityToken: string, user: string) {
    const data = await request<any>('/authenticate_apple_user', {
      method: 'POST',
      body: JSON.stringify({ identity_token: identityToken, user }),
    });
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },
};

// ─── Products ───
export const products = {
  async getCategories() {
    return request<any>('/products/categories');
  },

  async getCategoryProducts(categoryId: number) {
    return request<any>(`/products/category/${categoryId}`);
  },

  async getAisleProducts(aisleId: number) {
    return request<any>(`/products/aisle/${aisleId}`);
  },

  async search(query: string) {
    return request<any>('/products/search', {
      method: 'POST',
      body: JSON.stringify({ search: query }),
    });
  },

  async getDetails(productId: number) {
    return request<any>(`/products/details/${productId}`);
  },

  async getBrands() {
    return request<any>('/products/brands_list');
  },

  async getBestSellers() {
    return request<any>('/products/best_sellers');
  },

  async getDeals() {
    return request<any>('/products/deals');
  },

  async getAlcoholDeals() {
    return request<any>('/products/alcohol_deals');
  },

  async getOrganic() {
    return request<any>('/products/organic');
  },

  async getSliders() {
    return request<any>('/products/sliders');
  },

  async filterProducts(filters: any) {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },
};

// ─── Cart ───
export const cart = {
  async get() {
    return request<any>('/cart', { method: 'POST' });
  },

  async addItem(productId: number, qty: number = 1) {
    return request<any>('/cart/add_item_to_cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, qty }),
    });
  },

  async updateQuantity(itemId: number, qty: number) {
    return request<any>('/cart/update_cart_item_qty', {
      method: 'PUT',
      body: JSON.stringify({ item_id: itemId, qty }),
    });
  },

  async removeItem(itemId: number) {
    return request<any>('/cart/delete_cart_item', {
      method: 'DELETE',
      body: JSON.stringify({ item_id: itemId }),
    });
  },

  async empty() {
    return request<any>('/cart/empty_cart', { method: 'POST' });
  },

  async getResortsAndCities() {
    return request<any>('/cart/resorts_and_cities');
  },

  async calculateOrderSummary(data: any) {
    return request<any>('/cart/calculate_order_summary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async validateDeliveryInfo(data: any) {
    return request<any>('/cart/validate_delivery_info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async capturePayment(data: any) {
    return request<any>('/cart/capture_payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ─── User ───
export const user = {
  async getOrders() {
    return request<any>('/user/orders', { method: 'POST' });
  },

  async getOrder(orderId: number) {
    return request<any>(`/user/order/${orderId}`, { method: 'POST' });
  },

  async getFavorites() {
    return request<any>('/user/favorites', { method: 'POST' });
  },

  async addToFavorites(productId: number) {
    return request<any>('/user/add_to_favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeFromFavorites(productId: number) {
    return request<any>('/user/remove_from_favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async getGiftCertificates() {
    return request<any>('/user/gift_certificates', { method: 'POST' });
  },

  async checkGiftCertificateBalance(code: string) {
    return request<any>('/user/gift_certificate_balance', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async getOrdersEligibleForAddOn() {
    return request<any>('/user/orders_eligible_for_add_on', { method: 'POST' });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return request<any>('/user/password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      }),
    });
  },

  async deleteAccount() {
    return request<any>('/user/delete_account', { method: 'DELETE' });
  },
};

export default { auth, products, cart, user };
