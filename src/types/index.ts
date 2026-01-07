export interface ProductImage {
  src: string;
  alt?: string;
}

export interface Variant {
  id: number;
  title: string;
  price?: string;
  inventory_quantity?: number;
}

export interface Discount {
  enabled: boolean;
  value: string;
  type: 'percent' | 'flat';
}

export interface Product {
  id: number | string;
  title: string;
  image?: ProductImage | null;
  variants: Variant[];
  discount?: Discount;
}

export interface SelectedProduct extends Product {
  variants: Variant[];
}

