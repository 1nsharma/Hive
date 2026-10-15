import { Product } from '../types';
import { Plus, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-white">
      <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100 relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        
        {product.stock <= 2 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-900 rounded-sm">
            Only {product.stock} left
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col pt-5 pb-6 px-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
              <a href={`#${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </a>
            </h3>
            <p className="mt-1 text-sm text-stone-500">{product.category}</p>
          </div>
          <p className="text-base font-medium text-stone-900">${product.price}</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-600 line-clamp-2 flex-1">
          {product.description}
        </p>
        
        <div className="mt-6 flex items-center justify-between z-10 relative">
          {product.affiliateLink ? (
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 hover:border-amber-900 hover:bg-amber-100 transition-all active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
              Get via {product.affiliateName || 'Partner'}
            </a>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-900 hover:border-stone-900 hover:bg-stone-50 transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add to Archive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
