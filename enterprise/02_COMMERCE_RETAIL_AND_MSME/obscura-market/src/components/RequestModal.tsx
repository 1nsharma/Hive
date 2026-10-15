import { useState } from 'react';
import { X, Search } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

export function RequestModal({ isOpen, onClose, onSubmit }: RequestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    onSubmit(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 pt-16 pb-4 backdrop-blur-sm sm:px-6 sm:p-0">
      <div 
        className="absolute inset-0 transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8">
        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button
            type="button"
            className="rounded-md bg-white text-stone-400 hover:text-stone-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-4 pb-8 pt-5 sm:p-6 sm:pb-8">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 sm:mx-0 sm:h-10 sm:w-10">
              <Search className="h-5 w-5 text-amber-700" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-xl font-serif font-semibold leading-6 text-stone-900" id="modal-title">
                Submit a Request
              </h3>
              <div className="mt-2">
                <p className="text-sm text-stone-500">
                  Can't find it online? Describe the artifact, piece of media, or curiosity you're looking for, and our seekers will attempt to source it offline.
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-stone-700">
                    What are you looking for?
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-900 sm:text-sm sm:leading-6"
                    placeholder="e.g. Discontinued 1994 Perfume"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-stone-700">
                    Additional Details
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-900 sm:text-sm sm:leading-6"
                    placeholder="Provide context, memories, brand names, locations..."
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 sm:w-auto"
            >
              Initiate Search
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 hover:bg-stone-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
