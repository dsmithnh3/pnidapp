'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusCircle, ArrowLeft, ArrowRight, Settings, Grid } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import PageThumbnail from './page-thumbnail'
import PageSettings from './page-settings'

interface PageNavigationProps {
  docId: string
  fileId: string
}

interface Page {
  id: string
  name: string
  page_number: number
  created_at: string
}

export default function PageNavigation({ docId, fileId }: PageNavigationProps) {
  const [pages, setPages] = useState<Page[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true)
      const supabase = createClient()
      
      // First, check if pages exist for this file
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('file_id', fileId)
        .order('page_number', { ascending: true })
        
      if (error) {
        console.error('Error fetching pages:', error)
        setLoading(false)
        return
      }
      
      // If no pages, create a default page
      if (data.length === 0) {
        const { data: newPage, error: createError } = await supabase
          .from('pages')
          .insert({
            file_id: fileId,
            name: 'Page 1',
            page_number: 1
          })
          .select()
          
        if (createError) {
          console.error('Error creating default page:', createError)
        } else {
          setPages(newPage)
          setCurrentPage(0)
        }
      } else {
        setPages(data)
        setCurrentPage(0) // Start with the first page
      }
      
      setLoading(false)
    }
    
    if (fileId) {
      fetchPages()
    }
  }, [fileId])
  
  const handleAddPage = async () => {
    const supabase = createClient()
    const newPageNumber = pages.length > 0 ? Math.max(...pages.map(p => p.page_number)) + 1 : 1
    
    const { data, error } = await supabase
      .from('pages')
      .insert({
        file_id: fileId,
        name: `Page ${newPageNumber}`,
        page_number: newPageNumber
      })
      .select()
      
    if (error) {
      console.error('Error adding page:', error)
      return
    }
    
    setPages([...pages, data[0]])
  }
  
  const handlePageSelect = (index: number) => {
    setCurrentPage(index)
  }
  
  const handlePageDelete = async (pageId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      
    if (error) {
      console.error('Error deleting page:', error)
      return
    }
    
    // Update UI and reset current page if needed
    const newPages = pages.filter(p => p.id !== pageId)
    setPages(newPages)
    
    if (newPages.length === 0) {
      // Create a new default page if all pages were deleted
      handleAddPage()
    } else if (currentPage >= newPages.length) {
      setCurrentPage(newPages.length - 1)
    }
    
    setShowSettings(false)
    setSelectedPageId(null)
  }
  
  const handlePageRename = async (pageId: string, newName: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .update({ name: newName })
      .eq('id', pageId)
      
    if (error) {
      console.error('Error renaming page:', error)
      return
    }
    
    // Update the UI
    setPages(pages.map(p => 
      p.id === pageId ? { ...p, name: newName } : p
    ))
    
    setShowSettings(false)
    setSelectedPageId(null)
  }
  
  const openSettings = (pageId: string) => {
    setSelectedPageId(pageId)
    setShowSettings(true)
  }
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading pages...</p>
      </div>
    )
  }
  
  if (showSettings && selectedPageId) {
    return (
      <PageSettings
        page={pages.find(p => p.id === selectedPageId)!}
        onBack={() => setShowSettings(false)}
        onDelete={handlePageDelete}
        onRename={handlePageRename}
      />
    )
  }
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between h-min shrink-0 py-2 px-4">
        <h2 className="text-md font-medium">Pages</h2>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleAddPage}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => openSettings(pages[currentPage]?.id)}
            disabled={pages.length === 0}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex-grow overflow-auto p-2">
        <ScrollArea className="h-full w-full rounded-md">
          <div className="grid grid-cols-2 gap-2">
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                isActive={index === currentPage}
                onClick={() => handlePageSelect(index)}
                onSettingsClick={() => openSettings(page.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}