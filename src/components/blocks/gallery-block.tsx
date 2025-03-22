'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { useCourseStore, BlockType } from "@/store/course-store"
import { Button } from "@/components/ui/button"

interface GalleryBlockProps {
  id: string;
  type: string;
  content: {
    images: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    showCaptions?: boolean;
    columns: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function GalleryBlock({ id, type, content, isSelected, onClick }: GalleryBlockProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Handle carousel navigation
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? content.images.length - 1 : prev - 1));
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === content.images.length - 1 ? 0 : prev + 1));
  };
  
  // Carousel gallery
  if (type === 'gallery-carousel') {
    return (
      <motion.div
        className={`mb-6 p-3 rounded-lg ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/30'}`}
        whileHover={{ scale: 1.01 }}
        onClick={onClick}
      >
        <div className="relative">
          <div className="overflow-hidden rounded-md">
            <div className="relative">
              {content.images.map((image: any, index: number) => (
                <div 
                  key={index}
                  className={`${currentSlide === index ? 'block' : 'hidden'}`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full"
                  />
                  {content.showCaptions && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          >
            ←
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          >
            →
          </Button>
          
          {content.showCaptions && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {content.images.map((_: any, index: number) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
  
  // Grid galleries (2, 3, or 4 columns)
  if (type.includes('gallery-')) {
    const columnsCount = type === 'gallery-2-columns' ? 2 : type === 'gallery-3-columns' ? 3 : 4;
    const gridClass = `grid grid-cols-1 md:grid-cols-${columnsCount} gap-4`;
    
    return (
      <motion.div
        className={`mb-6 p-3 rounded-lg ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/30'}`}
        whileHover={{ scale: 1.01 }}
        onClick={onClick}
      >
        <div className={gridClass}>
          {content.images.map((image: any, index: number) => (
            <div key={index} className="relative">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full rounded-md"
              />
              {content.showCaptions && image.caption && (
                <div className="p-2 text-sm text-center">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  return null;
} 