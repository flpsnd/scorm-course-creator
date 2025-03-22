'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { useCourseStore } from "@/store/course-store"
import { ChevronDown, ChevronRight, Columns, Image, Images, Box, Eye, EyeOff, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Type, AlertCircle, Quote, List, Film, HelpCircle, BarChart, Minus, Square, Layout } from "lucide-react"

interface BlockGroup {
  title: string;
  blocks: string[];
}

const blockGroups: BlockGroup[] = [
  {
    title: 'Text',
    blocks: [
      'text-paragraph',
      'text-paragraph-heading',
      'text-paragraph-subheading',
      'text-heading',
      'text-subheading'
    ]
  },
  {
    title: 'Layout',
    blocks: [
      'layout-2-columns',
      'layout-3-columns',
      'layout-2-columns-25-75',
      'layout-2-columns-75-25',
      'layout-3-columns-25-50-25',
      'layout-table'
    ]
  },
  {
    title: 'Statements',
    blocks: [
      'statement-a',
      'statement-b',
      'statement-c',
      'statement-d',
      'statement-note'
    ]
  },
  {
    title: 'Quotes',
    blocks: [
      'quote-a',
      'quote-b',
      'quote-c',
      'quote-d',
      'quote-on-image',
      'quote-carousel'
    ]
  },
  {
    title: 'Lists',
    blocks: [
      'list-numbered',
      'list-checkbox',
      'list-bulleted'
    ]
  },
  {
    title: 'Images',
    blocks: [
      'image-centered',
      'image-full-width',
      'image-text',
      'text-on-image'
    ]
  },
  {
    title: 'Galleries',
    blocks: [
      'gallery-carousel',
      'gallery-2-columns',
      'gallery-3-columns',
      'gallery-4-columns'
    ]
  },
  {
    title: 'Multimedia',
    blocks: [
      'multimedia-audio',
      'multimedia-video',
      'multimedia-embed',
      'multimedia-attachment',
      'multimedia-code'
    ]
  },
  {
    title: 'Interactive',
    blocks: [
      'interactive-accordion',
      'interactive-tabs',
      'interactive-labeled-graphic',
      'interactive-process',
      'interactive-scenario',
      'interactive-sorting',
      'interactive-timeline',
      'interactive-flashcard-grid',
      'interactive-flashcard-stack',
      'interactive-button',
      'interactive-button-stack',
      'interactive-storyline'
    ]
  },
  {
    title: 'Knowledge Check',
    blocks: [
      'knowledge-multiple-choice',
      'knowledge-multiple-response',
      'knowledge-fill-blank',
      'knowledge-matching',
      'knowledge-question-bank'
    ]
  },
  {
    title: 'Charts',
    blocks: [
      'chart-bar',
      'chart-line',
      'chart-pie'
    ]
  },
  {
    title: 'Dividers',
    blocks: [
      'divider-continue',
      'divider-line',
      'divider-numbered',
      'divider-spacer'
    ]
  },
  {
    title: 'Templates',
    blocks: [
      'template-custom'
    ]
  }
];

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState("blocks")
  const [expandedGroups, setExpandedGroups] = useState<string[]>(blockGroups.map(g => g.title))
  const blocks = useCourseStore(state => state.history.present)
  const selectedBlockId = useCourseStore(state => state.selectedBlockId)
  const addBlock = useCourseStore(state => state.addBlock)
  const removeBlock = useCourseStore(state => state.removeBlock)
  const toggleBlockVisibility = useCourseStore(state => state.toggleBlockVisibility)
  
  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, blockType: string) => {
    e.dataTransfer.setData('text/plain', blockType);
  }

  const renderBlockItem = (blockType: string) => {
    const label = blockType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
      <div
        key={blockType}
        className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-move"
        draggable
        onDragStart={(e) => handleDragStart(e, blockType)}
      >
        <div className="w-4 h-4 mr-2 flex items-center justify-center">
          <BlockIcon type={blockType} />
        </div>
        <span className="text-sm">{label}</span>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
          <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
          <TabsTrigger value="assets" className="flex-1">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="blocks" className="p-4">
          <div className="space-y-4">
            {blockGroups.map((group) => (
              <div key={group.title}>
                <button
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => toggleGroup(group.title)}
                >
                  <span className="font-medium">{group.title}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      expandedGroups.includes(group.title) ? "transform rotate-180" : ""
                    )}
                  />
                </button>
                {expandedGroups.includes(group.title) && (
                  <div className="mt-2 space-y-1">
                    {group.blocks.map(renderBlockItem)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="layers" className="p-4">
          <LayersPanel />
        </TabsContent>
        <TabsContent value="assets" className="p-4">
          <AssetsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BlockIcon({ type }: { type: string }) {
  // Simple icon mapping based on block type
  const category = type.split('-')[0];
  
  switch (category) {
    case 'text':
      return <Type className="w-4 h-4" />;
    case 'layout':
      return <Columns className="w-4 h-4" />;
    case 'statement':
      return <AlertCircle className="w-4 h-4" />;
    case 'quote':
      return <Quote className="w-4 h-4" />;
    case 'list':
      return <List className="w-4 h-4" />;
    case 'image':
      return <Image className="w-4 h-4" />;
    case 'gallery':
      return <Images className="w-4 h-4" />;
    case 'multimedia':
      return <Film className="w-4 h-4" />;
    case 'interactive':
      return <Box className="w-4 h-4" />;
    case 'knowledge':
      return <HelpCircle className="w-4 h-4" />;
    case 'chart':
      return <BarChart className="w-4 h-4" />;
    case 'divider':
      return <Minus className="w-4 h-4" />;
    case 'template':
      return <Layout className="w-4 h-4" />;
    default:
      return <Square className="w-4 h-4" />;
  }
}

function LayersPanel() {
  // Implementation of LayersPanel component
  return (
    <div>
      {/* Implementation of LayersPanel component */}
    </div>
  )
}

function AssetsPanel() {
  // Implementation of AssetsPanel component
  return (
    <div>
      {/* Implementation of AssetsPanel component */}
    </div>
  )
} 