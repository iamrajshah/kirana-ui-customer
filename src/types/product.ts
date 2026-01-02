export interface Product {
  id: string;
  name: string;
  image_url: string | null;
  category: {
    id: string;
    name: string;
  };
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  variant_name: string | null;
  selling_price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      skip: number;
      take: number;
    };
  };
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}
