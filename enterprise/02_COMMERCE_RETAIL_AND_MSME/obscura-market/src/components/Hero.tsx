export function Hero() {
  return (
    <div className="relative overflow-hidden bg-stone-900 text-stone-50">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Find what the internet forgot.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
            Welcome to the marketplace for the unfindable. We source physical artifacts, rare media, and offline-only creations that exist entirely outside the digital index.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#catalog"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore the Archive
            </a>
            <a href="#how-it-works" className="text-sm font-semibold leading-6 text-stone-300 hover:text-white transition-colors">
              How requests work <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
