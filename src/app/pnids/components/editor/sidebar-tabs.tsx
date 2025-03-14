'use client'

import { useEffect } from 'react'
import { useEditorStore, SidebarTab } from './store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileText, Layers, MessageSquare } from 'lucide-react'
import NodeList from './node-list'
import PageNavigation from './page-navigation'

interface SidebarTabsProps {
  docId: string
  viewOnly?: boolean
  fileId?: string
}

export default function SidebarTabs({ 
  docId, 
  viewOnly = false, 
  fileId = ''
}: SidebarTabsProps) {
  const { activeSidebarTab, setActiveSidebarTab } = useEditorStore()
  
  // Reset to elements tab when switching views
  useEffect(() => {
    setActiveSidebarTab('elements')
  }, [docId, setActiveSidebarTab])
  
  return (
    <Tabs 
      value={activeSidebarTab} 
      onValueChange={(value) => setActiveSidebarTab(value as SidebarTab)} 
      className="flex flex-col h-full w-full bg-white dark:bg-black rounded-md border overflow-hidden" 
      defaultValue="elements"
    >
      <TabsList className={`w-full grid ${viewOnly ? 'grid-cols-2' : 'grid-cols-3'} border-b border-border`}>
        <TabsTrigger value="elements" className="flex items-center justify-center gap-1.5 py-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Elements</span>
        </TabsTrigger>
        
        <TabsTrigger value="pages" className="flex items-center justify-center gap-1.5 py-2">
          <Layers className="h-4 w-4" />
          <span className="font-medium">Pages</span>
        </TabsTrigger>
        
        {!viewOnly && (
          <TabsTrigger value="annotations" className="flex items-center justify-center gap-1.5 py-2">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">Notes</span>
          </TabsTrigger>
        )}
      </TabsList>
      
      <div className="flex-1 overflow-hidden">
        <TabsContent value="elements" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:h-full">
          <NodeList docId={docId} />
        </TabsContent>
        
        <TabsContent value="pages" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:h-full">
          {fileId ? (
            <PageNavigation docId={docId} fileId={fileId} />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-sm text-muted-foreground">Page navigation requires a file ID</p>
            </div>
          )}
        </TabsContent>
        
        {!viewOnly && (
          <TabsContent value="annotations" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:h-full">
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium mb-4">Annotations</h3>
              <p className="text-sm text-muted-foreground">
                Add notes and annotations to your P&ID diagram.
              </p>
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Annotations feature coming soon
                </p>
              </div>
            </div>
          </TabsContent>
        )}
      </div>
    </Tabs>
  )
}