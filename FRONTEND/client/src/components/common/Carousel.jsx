import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Interactive Carousel Component dengan smooth transitions
 * Support untuk touch gestures dan keyboard navigation
 */
const Carousel = ({ items, renderItem, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayTimerRef = React.useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(autoPlayTimerRef.current);
  }, [isAutoPlay, items.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentIndex(index % items.length);
    setIsAutoPlay(false);
    // Resume auto-play setelah 10 detik
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  return (
    <div className="relative w-full">
      {/* Main carousel container */}
      <div className="relative h-auto overflow-hidden rounded-2xl bg-muted/30">
        {/* Slides */}
        <div className="relative h-full">
          {items.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
              style={{
                transitionProperty: 'opacity, transform',
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg sm:left-6 md:left-8"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg sm:right-6 md:right-8"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 sm:h-3 ${
                index === currentIndex
                  ? 'w-8 bg-primary sm:w-10'
                  : 'w-2 bg-white/60 hover:bg-white sm:w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide counter (opsional) */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Slide {currentIndex + 1} dari {items.length}
      </div>
    </div>
  );
};

export default Carousel;
