export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  images: string[];
  type: 'template' | 'slide' | 'doc';
  description: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
