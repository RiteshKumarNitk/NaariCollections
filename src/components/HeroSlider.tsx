
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface HeroSliderProps {
  images: string[];
  children: React.ReactNode;
  interval?: number;
}

export function HeroSlider({ images, children, interval = 5000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length > 1) {
      const timer = setTimeout(nextSlide, interval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, interval, images.length]);

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`Hero image ${currentIndex + 1}`}
            fill
            className="object-cover"
            data-ai-hint="elegant ethnic background"
            priority={currentIndex === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative h-full">
        {children}
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <Button onClick={prevSlide} variant="outline" size="icon" className="bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-full">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
                {images.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`}
                    aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            <Button onClick={nextSlide} variant="outline" size="icon" className="bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-full">
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
      )}

    </section>
  );
}
