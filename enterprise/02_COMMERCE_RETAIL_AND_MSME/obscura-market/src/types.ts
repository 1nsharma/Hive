export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  affiliateLink?: string;
  affiliateName?: string;
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'searching' | 'found';
  dateRequested: string;
}
