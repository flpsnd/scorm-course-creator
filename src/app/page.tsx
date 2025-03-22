'use client'

import { useCourseStore } from "@/store/course-store"
import { Header } from "@/components/layout/header"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { ContentArea } from "@/components/layout/content-area"

export default function Home() {
  const selectedBlockId = useCourseStore(state => state.selectedBlockId)
  
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <ContentArea />
        <RightSidebar isActive={!!selectedBlockId} />
      </div>
    </main>
  )
}
