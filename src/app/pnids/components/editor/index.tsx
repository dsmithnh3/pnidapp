'use client'
import { useEffect, useState } from 'react'
import XYFlow from './xyflow'
import { ReactFlowProvider } from 'reactflow'
import ViewerFlow from './xyflow/viewer'
import SidebarTabs from './sidebar-tabs'
import { useDocument } from '@/lib/reactquery/useDocument'

export function Viewer({ docId }: { docId: string }) {
  const { data: document, isLoading } = useDocument(docId)
  const [fileId, setFileId] = useState<string>('')
  
  useEffect(() => {
    if (document) {
      setFileId(document.id)
    }
  }, [document])
  
  return (
    <>
      <ReactFlowProvider>
        <div className='w-full h-full p-2 flex items-center justify-between gap-1.5 max-h-full overflow-auto'>
          <div className='h-full w-[75%] bg-white dark:bg-black shrink-0 rounded-md border'>
            <ViewerFlow docId={docId} />
          </div>
          <div className='h-full w-[25%]'>
            <SidebarTabs docId={docId} viewOnly={true} fileId={fileId} />
          </div>
        </div>
      </ReactFlowProvider>
    </>
  )
}

export default function Editor({ docId }: { docId: string }) {
  const { data: document, isLoading } = useDocument(docId)
  const [fileId, setFileId] = useState<string>('')
  
  useEffect(() => {
    if (document) {
      setFileId(document.id)
    }
  }, [document])
  
  return (
    <>
      <ReactFlowProvider>
        <div className='w-full h-full p-2 flex items-center justify-between gap-1.5 max-h-full overflow-auto'>
          <div className='h-full w-[75%] bg-white dark:bg-black shrink-0 rounded-md border'>
            <XYFlow docId={docId} />
          </div>
          <div className='h-full w-[25%]'>
            <SidebarTabs docId={docId} fileId={fileId} />
          </div>
        </div>
      </ReactFlowProvider>
    </>
  )
}