'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface PageSettingsProps {
  page: {
    id: string
    name: string
    page_number: number
  }
  onBack: () => void
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export default function PageSettings({ 
  page, 
  onBack, 
  onDelete, 
  onRename 
}: PageSettingsProps) {
  const [pageName, setPageName] = useState(page.name)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  
  const handleRename = () => {
    if (pageName.trim() && pageName !== page.name) {
      onRename(page.id, pageName)
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-min py-2 px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 mr-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-md font-medium">Page Settings</h2>
      </div>
      <Separator />
      
      <div className="p-4 flex-1">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Page Name</h3>
          <div className="flex items-center gap-2">
            <Input
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              className="flex-1"
              placeholder="Enter page name"
            />
            <Button onClick={handleRename} size="sm">
              Rename
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 text-destructive">Danger Zone</h3>
          <div className="border border-destructive/30 rounded-md p-3">
            {!deleteConfirm ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Deleting this page will remove all elements associated with it.
                  This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Page
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium mb-2">
                  Are you sure you want to delete this page?
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(page.id)}
                  >
                    Yes, Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}