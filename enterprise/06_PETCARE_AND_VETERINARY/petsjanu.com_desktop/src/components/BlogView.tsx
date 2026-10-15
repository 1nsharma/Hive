import React, { useState } from 'react';
import { BookOpen, Search, Calendar, User, ArrowRight, Tag, Share2 } from 'lucide-react';

interface BlogViewProps {
  onNavigateTab: (tab: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onNavigateTab }) => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const articles = [
    {
      id: 'lost-dog-guide',
      title: 'What to Do Immediately If Your Dog Is Lost in India',
      category: 'Pet Safety',
      readTime: '5 min read',
      date: 'Feb 10, 2026',
      author: 'Dr. Ananya Sharma (Vet & Pet Parent)',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      summary: 'Actionable emergency steps to find a missing dog in Indian urban neighborhoods, utilizing smart QR tags, local WhatsApp colony groups, and feeder networks.',
      content: `Losing a pet in a noisy, fast-moving Indian city is every pet parent's worst nightmare. However, acting fast within the first 2 hours increases the chance of a safe reunion by over 80%.

1. **Activate Your PetJanu SOS Mode**
Flip the Lost toggle on your PetJanu dashboard immediately. This transforms your pet's public tag page into an emergency red alert banner with your masked phone number and live sighting reporting buttons.

2. **Alert Local Colony Feeders & Gate Guards**
Community street feeders and watchmen in your lane know almost every dog and movement in the area. Share your PetJanu digital flyer with photo, breed, and last seen location directly in local WhatsApp colony groups.

3. **Check Nearby Tea Stalls & Construction Sites**
Dogs that bolt out due to loud fireworks or stray dog chases usually hide under parked cars, near tea stalls, or behind building basements within a 500-meter radius.

4. **Keep Your Phone Unlocked & Active**
When a friendly stranger or neighbor scans your pet's QR tag, you will receive an immediate SMS notification and WhatsApp location pin. Be ready to pick up masked calls.`
    },
    {
      id: 'vaccination-schedule-india',
      title: 'Complete Vaccination Schedule for Indian Dogs (2026 Guide)',
      category: 'Health & Care',
      readTime: '7 min read',
      date: 'Jan 28, 2026',
      author: 'Dr. Rajesh Verma (VCI Registered Veterinarian)',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
      summary: 'Essential protection against Parvovirus, Canine Distemper, and Rabies in India. Includes cost breakdowns, booster timings, and side effect advice.',
      content: `Vaccinating your puppy or adopted dog is the single most effective barrier against deadly viral infections common in tropical Indian climates.

### Core Puppy Vaccines
- **6 to 8 Weeks:** DHPPi 1st Dose (Distemper, Hepatitis, Parvovirus, Parainfluenza).
- **10 to 12 Weeks:** DHPPi 2nd Booster + Corona Vaccine.
- **14 to 16 Weeks:** Rabies Vaccine (ARV) — mandatory across all Indian municipalities.

### Annual Booster Protocol
Adult dogs require one annual booster shot combining DHPPi and Anti-Rabies to maintain antibody levels.

### Deworming Routine
Given high exposure to soil microbes and outdoor walks, dogs in India should be dewormed every 3 months with vet-recommended tablets like Drontal Plus or Kiwof.`
    },
    {
      id: 'best-food-indie-dogs',
      title: 'Nutrition Guide: Best Food & Diet for Indian Indie Dogs',
      category: 'Pet Nutrition',
      readTime: '6 min read',
      date: 'Jan 15, 2026',
      author: 'Priya Nair (Pet Nutrition Specialist)',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      summary: 'How to nourish native Indian Street/Indie dogs with balanced home-cooked meals, curd, boiled chicken, eggs, and grain-free kibble.',
      content: `Indian Pariah dogs and Indie mixes possess robust digestive systems honed over thousands of years, but they still thrive best on balanced protein, healthy fats, and probiotics.

### Safe Home-Cooked Staples
1. **Boiled Chicken & Pumpkin:** Excellent for sensitive stomachs and solid digestion.
2. **Eggs & Curd (Dahi):** Curd provides cooling probiotics during hot Indian summers, while boiled eggs offer bioavailable protein.
3. **Sweet Potato & Rice:** Carbs that provide sustained energy without triggering skin itchiness.

### Foods to Avoid
Never feed dogs chocolate, onions, garlic, grapes, cooked chicken bones, or spicy masala curries.`
    }
  ];

  const activeArticleObj = articles.find(a => a.id === selectedArticle);

  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0A21E]/20 text-amber-900 border border-[#F0A21E]/30">
          <BookOpen className="w-3.5 h-3.5" /> PETJANU PARENT BLOG
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Vet-Reviewed <span className="text-[#175741]">Pet Care Guides</span> for India
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-medium">
          Practical advice on pet safety, vaccination schedules, nutrition, and caring for Indian dogs and cats.
        </p>
      </div>

      {/* Article Detail Reader Modal / View */}
      {activeArticleObj ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-[#E5DFD3] shadow-md space-y-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-[#175741] hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Back to all articles
          </button>

          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
              {activeArticleObj.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1C2B23]">{activeArticleObj.title}</h2>
            <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
              <span>By {activeArticleObj.author}</span>
              <span>•</span>
              <span>{activeArticleObj.date}</span>
              <span>•</span>
              <span>{activeArticleObj.readTime}</span>
            </div>
          </div>

          <img
            src={activeArticleObj.image}
            alt={activeArticleObj.title}
            className="w-full h-80 object-cover rounded-2xl border border-[#E5DFD3]"
          />

          <div className="prose max-w-none text-stone-800 text-sm leading-relaxed whitespace-pre-line font-medium">
            {activeArticleObj.content}
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-between items-center">
            <button
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 cursor-pointer"
            >
              ← Back to Guides
            </button>
            <button
              onClick={() => alert("Link copied to clipboard!")}
              className="px-4 py-2 rounded-xl bg-[#175741] text-white text-xs font-bold hover:bg-[#175741]/90 cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Article
            </button>
          </div>
        </div>
      ) : (
        /* Article Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-48 object-cover rounded-2xl border border-stone-200"
                />
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-400">
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1C2B23] leading-snug">{art.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">{art.summary}</p>
              </div>

              <button
                onClick={() => setSelectedArticle(art.id)}
                className="w-full py-2.5 rounded-xl border border-[#175741] text-[#175741] font-extrabold text-xs hover:bg-emerald-50 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
