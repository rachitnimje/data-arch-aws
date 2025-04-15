"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Priya Sharma",
    position: "CTO, TechVista India",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "DataArch completely transformed our data infrastructure, enabling us to make faster, more informed decisions. Their expertise in cloud transformation was instrumental in our digital journey.",
    stars: 5,
  },
  {
    name: "Rajesh Patel",
    position: "Data Science Lead, InnovateAI Bangalore",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The AI-ready data lakes solution from DataArch has significantly accelerated our machine learning pipeline by 65%. A must-have for any AI-focused company in the Indian tech ecosystem.",
    stars: 5,
  },
  {
    name: "Ananya Desai",
    position: "VP of Engineering, Infotech Solutions",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Working with DataArch has been a game-changer for our organization. Their smart data pipelines have reduced our processing time by 70% and scaled seamlessly with our growing business in Mumbai.",
    stars: 5,
  },
  {
    name: "Vikram Malhotra",
    position: "CEO, AnalyticsFirst India",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "We've partnered with DataArch for over 3 years now across our Delhi and Hyderabad offices. Their team's expertise and dedication to our success has consistently exceeded our expectations.",
    stars: 5,
  },
  {
    name: "Meera Krishnan",
    position: "Head of Digital Transformation, Future Enterprises",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "DataArch's solutions helped us navigate the complex data challenges in our retail business. Their understanding of Indian market needs and technical expertise is truly exceptional.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile view on initial render and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setDirection("right")
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  // Pause autoplay on hover (only on desktop)
  const handleMouseEnter = () => !isMobile && setAutoplay(false)
  const handleMouseLeave = () => !isMobile && setAutoplay(true)

  // Touch event handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setAutoplay(false)
    setTouchStart(e.touches[0].clientX)
  }
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return
    
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    
    if (Math.abs(diff) < 50) {
      // Ignore small movements (likely just taps)
      setAutoplay(true)
      return
    }
    
    if (diff > 0) {
      // Swipe left, show next
      nextTestimonial()
    } else {
      // Swipe right, show previous
      prevTestimonial()
    }
    
    setTouchStart(null)
    setTimeout(() => setAutoplay(true), 3000) // Resume autoplay after swipe
  }

  const nextTestimonial = () => {
    setDirection("right")
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection("left")
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-12 md:py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Hear What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what industry leaders across India have to say about our data solutions.
          </p>
        </div>

        <div 
          className="max-w-4xl mx-auto relative" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Quote icon positioned consistently with the card */}
          <div className="absolute z-20 -left-2 md:-left-4 top-4 md:top-6 bg-white rounded-full p-1 md:p-2 shadow-md">
            <Quote className="h-4 w-4 md:h-6 md:w-6 text-purple-DEFAULT" />
          </div>

          {/* Indicator dots for mobile */}
          <div className="flex justify-center space-x-2 mb-4 md:hidden">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-purple-DEFAULT" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Fixed height container with consistent padding */}
          <div className="relative h-[350px] sm:h-[320px] md:h-[280px] overflow-hidden">
            <div className="absolute inset-0 rounded-lg card-gradient">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5,
                  }}
                  className="absolute inset-0 flex flex-col justify-between p-6 md:p-8"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center mb-4">
                      {Array.from({ length: testimonials[activeIndex].stars }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p className="text-gray-700 mb-6 italic text-sm md:text-lg">
                      "{testimonials[activeIndex].quote}"
                    </p>
                  </div>

                  {/* User info with consistent bottom spacing */}
                  <div className="flex items-center mt-auto">
                    <div className="rounded-full overflow-hidden mr-3 md:mr-4 border-2 border-purple-light">
                      <Image
                        src={testimonials[activeIndex].image || "/placeholder.svg"}
                        alt={testimonials[activeIndex].name}
                        width={50}
                        height={50}
                        className="object-cover w-10 h-10 md:w-12 md:h-12"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-base md:text-lg">{testimonials[activeIndex].name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{testimonials[activeIndex].position}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile, use swipe instead */}
          <button
            onClick={prevTestimonial}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-purple-DEFAULT" />
          </button>
          <button
            onClick={nextTestimonial}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-purple-DEFAULT" />
          </button>
        </div>
      </div>
    </section>
  )
}