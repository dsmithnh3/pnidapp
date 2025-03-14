'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface PageThumbnailProps {
  page: {
    id: string
    name: string
    page_number: number
  }
  isActive: boolean
  onClick: () => void
  onSettingsClick: () => void
}

export default function PageThumbnail({ 
  page, 
  isActive, 
  onClick, 
  onSettingsClick 
}: PageThumbnailProps) {
  return (
    <div 
      className={cn(
        'relative flex flex-col items-center border rounded-md p-2 cursor-pointer hover:border-primary transition-colors duration-200 group',
        isActive ? 'border-primary bg-primary/5' : 'border-border'
      )}
      onClick={onClick}
    >
      {/* Placeholder thumbnail */}
      <div className="w-full aspect-[4/3] bg-muted/30 rounded mb-2 flex items-center justify-center text-xs text-muted-foreground">
        Page {page.page_number}
      </div>
      <div className="w-full truncate text-xs text-center font-medium">
        {page.name}
      </div>
      
      {/* Settings button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onSettingsClick()
        }}
      >
        <Settings className="h-3 w-3" />
      </Button>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-primary rounded-b-sm" />
      )}
    </div>
  )
}