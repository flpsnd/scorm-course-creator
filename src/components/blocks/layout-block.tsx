'use client'

import { motion } from "framer-motion"
import { useCourseStore, BlockType } from "@/store/course-store"

interface LayoutBlockProps {
  id: string;
  type: string;
  content: {
    columns: Array<{
      width: number;
      content: any[];
    }>;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function LayoutBlock({ id, type, content, isSelected, onClick }: LayoutBlockProps) {
  return (
    <motion.div
      className={`p-4 mb-4 rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {content.columns.map((column, index) => (
          <div
            key={index}
            className="min-h-[100px] rounded bg-muted/20 p-4"
            style={{ width: `${column.width}%` }}
          >
            <div className="text-center text-muted-foreground">
              Column {index + 1}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 