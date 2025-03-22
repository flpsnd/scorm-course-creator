'use client'

import { motion } from "framer-motion"
import { useCourseStore, BlockType } from "@/store/course-store"

interface ImageBlockProps {
  id: string;
  type: string;
  content: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
  };
  isSelected: boolean;
  onClick: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ImageBlock({ id, type, content, isSelected, onClick, onDrop, onDragOver }: ImageBlockProps) {
  return (
    <motion.div
      className={`p-4 mb-4 rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="relative" style={{ width: `${content.width || 100}%`, margin: '0 auto' }}>
        <img 
          src={content.src} 
          alt={content.alt}
          className="w-full h-auto rounded-lg"
        />
        {content.caption && (
          <p className="text-sm text-center text-muted-foreground mt-2">{content.caption}</p>
        )}
      </div>
    </motion.div>
  );
} 