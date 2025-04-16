"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { ClientMarquee } from "@/components/home/client-marquee"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FAQSection } from "@/components/home/faq-section"
import { ContactSection } from "@/components/home/contact-section"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"

    // Set loading to false after a short delay to ensure all components are ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    // Intersection Observer for animation on scroll
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Only observe sections after initial load
    setTimeout(() => {
      document.querySelectorAll("section").forEach((section) => {
        observer.observe(section)
      })
    }, 1000)

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-DEFAULT border-r-transparent border-b-blue-DEFAULT border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading DataArch...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      {/* <ServicesSection /> */}
      <ClientMarquee />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </main>
  )
}
