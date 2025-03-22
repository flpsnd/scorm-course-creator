'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { useCourseStore, BlockType } from "@/store/course-store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

interface InteractiveBlockProps {
  id: string;
  type: string;
  content: Record<string, any>;
  isSelected: boolean;
  onClick: () => void;
}

export function InteractiveBlock({ id, type, content, isSelected, onClick }: InteractiveBlockProps) {
  return (
    <motion.div
      className={`p-4 mb-4 rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
    >
      <div className="text-center text-muted-foreground">
        {type} - Interactive block placeholder
      </div>
    </motion.div>
  );
} 