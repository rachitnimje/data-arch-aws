"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"

interface PageLayoutProps {
  children: ReactNode
  isLoading?: boolean
}

export function PageLayout({ children, isLoading = false }: PageLayoutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
