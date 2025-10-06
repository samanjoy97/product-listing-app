export interface ProductResponse {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ratingData;
}

export interface ratingData {
  rate: number;
  count: number;
}
