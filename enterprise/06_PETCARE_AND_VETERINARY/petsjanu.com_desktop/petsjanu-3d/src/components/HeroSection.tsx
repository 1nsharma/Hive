import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
    >
      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

export function HeroSection() {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "3D Animation",
      description: "Stunning real-time 3D visuals powered by React Three Fiber",
      delay: 0.1,
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Optimized performance with modern web technologies",
      delay: 0.2,
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description: "Your data stays protected with enterprise-grade security",
      delay: 0.3,
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6">
            ✨ Next Generation Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Build Amazing Experiences
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Harness the power of modern web technologies to create stunning, 
            interactive 3D experiences that captivate your audience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
            Get Started Free
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300">
            View Documentation
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
