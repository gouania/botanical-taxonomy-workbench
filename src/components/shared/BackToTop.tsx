import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-slate-800/80 hover:bg-cyan-600 text-white rounded-full shadow-lg backdrop-blur-md transition-all z-50 border border-slate-700/50 hover:border-cyan-500/50 print:hidden"
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  );
}
