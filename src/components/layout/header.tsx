'use client'

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Undo2, Redo2, ZoomIn, ZoomOut, Monitor, Tablet, Smartphone } from "lucide-react"
import { useCourseStore } from "@/store/course-store"
import { useState, useEffect } from "react"

export function Header() {
  const [zoom, setZoom] = useState(100)
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  
  const undo = useCourseStore(state => state.undo)
  const redo = useCourseStore(state => state.redo)
  const canUndo = useCourseStore(state => state.canUndo())
  const canRedo = useCourseStore(state => state.canRedo())

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50))
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  useEffect(() => {
    const contentArea = document.querySelector('.content-area') as HTMLElement
    if (contentArea) {
      contentArea.style.transform = `scale(${zoom / 100})`
      contentArea.style.transformOrigin = 'center top'
    }
  }, [zoom])

  const handleDeviceChange = (value: string) => {
    if (!value) return // Handle the case when value is empty string
    setDevice(value as "desktop" | "tablet" | "mobile")
    const contentArea = document.querySelector('.content-area') as HTMLElement
    if (contentArea) {
      switch (value) {
        case 'mobile':
          contentArea.style.maxWidth = '375px'
          break
        case 'tablet':
          contentArea.style.maxWidth = '768px'
          break
        case 'desktop':
          contentArea.style.maxWidth = '1200px'
          break
      }
    }
  }

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          disabled={!canRedo}
          onClick={redo}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={handleZoomChange}
            min={50}
            max={200}
            step={10}
            className="w-32"
          />
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <span className="text-sm w-12">{zoom}%</span>
        </div>

        <ToggleGroup type="single" value={device} onValueChange={handleDeviceChange}>
          <ToggleGroupItem value="desktop">
            <Monitor className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet">
            <Tablet className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile">
            <Smartphone className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-[100px]" /> {/* Spacer to center the zoom controls */}
    </div>
  )
} 