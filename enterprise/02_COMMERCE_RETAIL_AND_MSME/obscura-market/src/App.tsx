/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { RequestModal } from './components/RequestModal';
import { PRODUCTS, MOCK_REQUESTS } from './data';
import { Product, RequestItem } from './types';

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>(MOCK_REQUESTS);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleSubmitRequest = (title: string, description: string) => {
    const newRequest: RequestItem = {
      id: `r${Date.now()}`,
      title,
      description,
      status: 'pending',
      dateRequested: new Date().toISOString().split('T')[0]
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 scroll-smooth">
      <Header 
        onOpenRequest={() => setIsRequestModalOpen(true)} 
        cartCount={cart.length} 
      />
      
      <main>
        <Hero />
        
        <div id="catalog" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between border-b border-stone-200 pb-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">The Archive</h2>
              <p className="mt-2 text-sm text-stone-500">Curated artifacts currently available for acquisition.</p>
            </div>
            <div className="hidden sm:flex space-x-4">
              <select className="rounded-md border-0 py-1.5 pl-3 pr-8 text-stone-900 ring-1 ring-inset ring-stone-300 focus:ring-2 focus:ring-stone-900 sm:text-sm sm:leading-6">
                <option>All Categories</option>
                <option>Media</option>
                <option>Artifacts</option>
                <option>Instruments</option>
              </select>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </div>

        <div id="how-it-works" className="bg-stone-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center text-stone-50">
              <h2 className="text-base font-semibold leading-7 text-amber-500 uppercase tracking-widest">The Seekers</h2>
              <p className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Active Bounties & Requests
              </p>
              <p className="mt-6 text-lg leading-8 text-stone-300">
                These are items currently being sought by our community. Our offline network of seekers is searching for them.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {requests.map((request) => (
                  <div key={request.id} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-white">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-800 border border-stone-700">
                        <div className={`h-2.5 w-2.5 rounded-full ${request.status === 'searching' ? 'bg-amber-500 animate-pulse' : 'bg-stone-500'}`} />
                      </div>
                      {request.title}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-stone-400">
                      {request.description}
                    </dd>
                    <dd className="mt-2 text-xs font-mono text-stone-500 uppercase">
                      Status: {request.status} • Requested: {request.dateRequested}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-16 flex justify-center">
                 <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="rounded-full border border-stone-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Submit a New Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-sm leading-5 text-stone-500">
              &copy; {new Date().getFullYear()} Obscura Market. The internet forgot, but we didn't.
            </span>
          </div>
        </div>
      </footer>

      <RequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}
