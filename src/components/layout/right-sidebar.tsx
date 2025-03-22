'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCourseStore } from "@/store/course-store"

export function RightSidebar({ isActive = false }: { isActive?: boolean }) {
  const [activeTab, setActiveTab] = useState("style")
  const selectedBlockId = useCourseStore(state => state.selectedBlockId)
  const blocks = useCourseStore(state => state.blocks)
  const updateBlockContent = useCourseStore(state => state.updateBlockContent)
  const removeBlock = useCourseStore(state => state.removeBlock)
  
  // Get the selected block
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);
  
  const handleUpdateContent = (partialContent: Record<string, any>) => {
    if (selectedBlockId) {
      updateBlockContent(selectedBlockId, partialContent);
    }
  };
  
  const handleDeleteBlock = () => {
    if (selectedBlockId) {
      removeBlock(selectedBlockId);
    }
  };

  // If no block is selected, show an empty state
  if (!isActive || !selectedBlock) {
    return (
      <div className="w-64 border-l border-border h-[calc(100vh-3.5rem)] bg-background flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <p className="mb-4">No block selected</p>
          <p className="text-sm">Select a block to edit its properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 border-l border-border h-[calc(100vh-3.5rem)] bg-background">
      <Tabs defaultValue="style" className="h-full flex flex-col"
        onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-3 mx-2 mt-2">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Typography</h3>
            <div className="text-xs text-muted-foreground">
              {selectedBlock.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          </div>
          <Separator className="mb-4" />
          
          {/* Typography options - Show for text blocks */}
          {(selectedBlock.type === 'text' || selectedBlock.type.includes('text')) && (
            <div className="space-y-3">
              <div>
                <label className="text-xs block mb-1">Font Family</label>
                <select 
                  className="w-full p-1 text-sm border rounded"
                  value={selectedBlock.content.fontFamily || 'Inter'}
                  onChange={(e) => handleUpdateContent({ fontFamily: e.target.value })}
                >
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Poppins</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1">Font Size</label>
                <input 
                  type="range" 
                  className="w-full" 
                  min="12"
                  max="48"
                  value={selectedBlock.content.fontSize || 16}
                  onChange={(e) => handleUpdateContent({ fontSize: parseInt(e.target.value) })}
                />
                <div className="text-xs text-right">{selectedBlock.content.fontSize || 16}px</div>
              </div>
              <div>
                <label className="text-xs block mb-1">Font Weight</label>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant={selectedBlock.content.fontWeight === 'normal' ? 'default' : 'outline'} 
                    className="flex-1"
                    onClick={() => handleUpdateContent({ fontWeight: 'normal' })}
                  >
                    Regular
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedBlock.content.fontWeight === 'medium' ? 'default' : 'outline'} 
                    className="flex-1"
                    onClick={() => handleUpdateContent({ fontWeight: 'medium' })}
                  >
                    Medium
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedBlock.content.fontWeight === 'bold' ? 'default' : 'outline'} 
                    className="flex-1"
                    onClick={() => handleUpdateContent({ fontWeight: 'bold' })}
                  >
                    Bold
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Colors section */}
          <h3 className="font-medium mt-6 mb-2">Colors</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {(selectedBlock.type === 'text' || selectedBlock.type.includes('text')) && (
              <div>
                <label className="text-xs block mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    className="w-8 h-8 rounded border cursor-pointer" 
                    value={selectedBlock.content.color || '#000000'}
                    onChange={(e) => handleUpdateContent({ color: e.target.value })}
                  />
                  <input 
                    type="text" 
                    value={selectedBlock.content.color || '#000000'} 
                    className="flex-1 p-1 text-sm border rounded"
                    onChange={(e) => handleUpdateContent({ color: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs block mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  className="w-8 h-8 rounded border cursor-pointer"
                  value={selectedBlock.content.backgroundColor || '#FFFFFF'}
                  onChange={(e) => handleUpdateContent({ backgroundColor: e.target.value })}
                />
                <input 
                  type="text" 
                  value={selectedBlock.content.backgroundColor || '#FFFFFF'} 
                  className="flex-1 p-1 text-sm border rounded"
                  onChange={(e) => handleUpdateContent({ backgroundColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="flex-1 overflow-auto p-4">
          <h3 className="font-medium mb-2">Block Settings</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1">Block ID</label>
              <input 
                type="text" 
                value={selectedBlock.id} 
                className="w-full p-1 text-sm border rounded"
                readOnly 
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Block Type</label>
              <input 
                type="text"
                value={selectedBlock.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                className="w-full p-1 text-sm border rounded"
                readOnly
              />
            </div>
            
            {/* Block-specific settings */}
            {selectedBlock.type.startsWith('layout-') && (
              <div>
                <label className="text-xs block mb-1">Column Distribution</label>
                <div className="flex items-center gap-2">
                  {selectedBlock.content.columns.map((column: any, index: number) => (
                    <input 
                      key={index}
                      type="number" 
                      value={column.width} 
                      min="5"
                      max="95"
                      className="flex-1 p-1 text-sm border rounded"
                      onChange={(e) => {
                        const newColumns = [...selectedBlock.content.columns];
                        newColumns[index].width = parseInt(e.target.value);
                        handleUpdateContent({ columns: newColumns });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {selectedBlock.type.includes('image') && (
              <>
                <div>
                  <label className="text-xs block mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={selectedBlock.content.src || ''} 
                    className="w-full p-1 text-sm border rounded"
                    onChange={(e) => handleUpdateContent({ src: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1">Alt Text</label>
                  <input 
                    type="text" 
                    value={selectedBlock.content.alt || ''} 
                    className="w-full p-1 text-sm border rounded"
                    onChange={(e) => handleUpdateContent({ alt: e.target.value })}
                  />
                </div>
              </>
            )}
            
            {/* Show delete button for all blocks */}
            <div className="pt-4">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={handleDeleteBlock}
              >
                Delete Block
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="flex-1 overflow-auto p-4">
          <h3 className="font-medium mb-2">Spacing</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1">Margin</label>
              <div className="grid grid-cols-4 gap-1">
                <input 
                  type="number" 
                  value={selectedBlock.content.marginTop || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Top"
                  onChange={(e) => handleUpdateContent({ marginTop: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.marginRight || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Right"
                  onChange={(e) => handleUpdateContent({ marginRight: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.marginBottom || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Bottom"
                  onChange={(e) => handleUpdateContent({ marginBottom: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.marginLeft || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Left"
                  onChange={(e) => handleUpdateContent({ marginLeft: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1">Padding</label>
              <div className="grid grid-cols-4 gap-1">
                <input 
                  type="number" 
                  value={selectedBlock.content.paddingTop || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Top"
                  onChange={(e) => handleUpdateContent({ paddingTop: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.paddingRight || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Right"
                  onChange={(e) => handleUpdateContent({ paddingRight: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.paddingBottom || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Bottom"
                  onChange={(e) => handleUpdateContent({ paddingBottom: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={selectedBlock.content.paddingLeft || 0} 
                  className="p-1 text-sm border rounded" 
                  placeholder="Left"
                  onChange={(e) => handleUpdateContent({ paddingLeft: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          
          <h3 className="font-medium mt-6 mb-2">Size</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1">Width</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={selectedBlock.content.width || 100} 
                  className="flex-1 p-1 text-sm border rounded"
                  onChange={(e) => handleUpdateContent({ width: parseInt(e.target.value) })}
                />
                <select 
                  className="p-1 text-sm border rounded"
                  value={selectedBlock.content.widthUnit || '%'}
                  onChange={(e) => handleUpdateContent({ widthUnit: e.target.value })}
                >
                  <option>%</option>
                  <option>px</option>
                  <option>rem</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1">Alignment</label>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={selectedBlock.content.alignment === 'left' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateContent({ alignment: 'left' })}
                >
                  Left
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedBlock.content.alignment === 'center' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateContent({ alignment: 'center' })}
                >
                  Center
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedBlock.content.alignment === 'right' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => handleUpdateContent({ alignment: 'right' })}
                >
                  Right
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 