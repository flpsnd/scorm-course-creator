'use client'

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCourseStore, BlockType } from "@/store/course-store"
import { LayoutBlock } from "../blocks/layout-block"
import { ImageBlock } from "../blocks/image-block"
import { GalleryBlock } from "../blocks/gallery-block"
import { InteractiveBlock } from "../blocks/interactive-block"

export function ContentArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = useCourseStore(state => state.history.present);
  const addBlock = useCourseStore(state => state.addBlock);
  const selectBlock = useCourseStore(state => state.selectBlock);
  const selectedBlockId = useCourseStore(state => state.selectedBlockId);
  const updateBlockContent = useCourseStore(state => state.updateBlockContent);
  
  const handleAddTextBlock = () => {
    addBlock('text');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Handle block drops from sidebar
    const blockType = e.dataTransfer.getData("blockType") as BlockType;
    if (blockType) {
      const id = addBlock(blockType);
      return;
    }
    
    // Handle file drops
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        // If multiple images are dropped, create a gallery
        if (imageFiles.length > 1) {
          const images = await Promise.all(imageFiles.map(async (file) => {
            const url = URL.createObjectURL(file);
            return {
              src: url,
              alt: file.name,
              caption: file.name
            };
          }));
          
          const blockId = addBlock('gallery-2-columns');
          if (blockId) {
            updateBlockContent(blockId, {
              images,
              showCaptions: true,
              columns: Math.min(4, imageFiles.length)
            });
          }
        }
        // If a single image is dropped, create an image block
        else {
          const file = imageFiles[0];
          const url = URL.createObjectURL(file);
          const blockId = addBlock('image-centered');
          if (blockId) {
            updateBlockContent(blockId, {
              src: url,
              alt: file.name,
              caption: file.name,
              width: 80
            });
          }
        }
      }
    }
  };
  
  const handleImageDrop = async (blockId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        updateBlockContent(blockId, {
          src: url,
          alt: file.name
        });
      }
    }
  };
  
  const renderBlockComponent = (type: BlockType, id: string, content: Record<string, any>) => {
    const isSelected = selectedBlockId === id;
    const commonProps = {
      id,
      content,
      isSelected,
      onClick: () => selectBlock(id),
      onDrop: (e: React.DragEvent<HTMLDivElement>) => handleImageDrop(id, e),
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }
    };
    
    if (type.startsWith('layout-')) {
      return <LayoutBlock {...commonProps} type={type} />;
    } else if (type.startsWith('image-')) {
      return <ImageBlock {...commonProps} type={type} />;
    } else if (type.startsWith('gallery-')) {
      return <GalleryBlock {...commonProps} type={type} />;
    } else if (type.startsWith('interactive-')) {
      return <InteractiveBlock {...commonProps} type={type} />;
    } else if (type === 'text') {
      return (
        <motion.div
          className={`p-4 mb-4 rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
          whileHover={{ scale: 1.01 }}
          onClick={() => selectBlock(id)}
        >
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none focus:outline-none"
            style={{ 
              fontSize: `${content.fontSize}px`,
              fontWeight: content.fontWeight,
              color: content.color,
              textAlign: content.alignment as any
            }}
          >
            {content.text}
          </div>
        </motion.div>
      );
    }
    
    return null;
  };
  
  return (
    <div 
      className="flex-1 h-[calc(100vh-3.5rem)] bg-gray-50 overflow-auto flex items-start justify-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        ref={containerRef}
        className="content-area my-8 bg-white rounded-lg shadow-sm min-h-[800px] transition-all duration-200"
        style={{ maxWidth: '1200px', width: '100%' }}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <h2 className="text-2xl font-semibold mb-2">Start creating your course</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Drag and drop blocks from the left sidebar to build your course content
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTextBlock}>Add Text Block</Button>
              <Button size="sm" variant="outline">Add Media</Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {blocks.map((block) => (
              block.isVisible !== false && (
                <div key={block.id}>
                  {renderBlockComponent(block.type, block.id, block.content)}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 