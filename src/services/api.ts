import type { Product } from '../types';

const API_KEY = '72njgfa948d9aS7gs5';

export async function searchProducts(
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/task/products/search?${params}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

