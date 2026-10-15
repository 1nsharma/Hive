
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-gray-900/70 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <svg className="w-8 h-8 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414m15.152 0l-1.414 1.414M5.636 18.364l-1.414 1.414m15.152 0l-1.414-1.414"></path>
          </svg>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI Project Roadmap Generator
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
