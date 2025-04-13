"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CTO, TechGrowth Inc.",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "DataArch transformed our data infrastructure, enabling us to make faster, more informed decisions. Their expertise in cloud transformation was invaluable.",
    stars: 5,
  },
  {
    name: "Michael Chen",
    position: "Data Science Lead, Innovate AI",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The AI-ready data lakes solution from DataArch has significantly accelerated our machine learning pipeline. Highly recommended for any AI-focused company.",
    stars: 5,
  },
  {
    name: "Emily Rodriguez",
    position: "VP of Engineering, DataFlow Systems",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Working with DataArch has been a game-changer for our organization. Their smart data pipelines have reduced our processing time by 70%.",
    stars: 5,
  },
  {
    name: "David Wilson",
    position: "CEO, DataFirst Analytics",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "We've partnered with DataArch for over 3 years now, and they continue to exceed our expectations. Their team's expertise and dedication to our success is unmatched.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState<"left" | "right">("right")

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setDirection("right")
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  const nextTestimonial = () => {
    setDirection("right")
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection("left")
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Hear What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what industry leaders have to say about our data solutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="absolute z-20 -left-4 -top-4 bg-white rounded-full p-2 shadow-md">
            <Quote className="h-6 w-6 text-purple-DEFAULT" />
          </div>

          {/* Fixed height container to prevent layout shift */}
          <div className="relative h-[300px] sm:h-[280px] overflow-hidden">
            <div className="absolute inset-0 rounded-lg card-gradient p-8 pt-12">
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
                  className="absolute inset-0 p-8 pt-12"
                >
                  <div className="flex items-center mb-6">
                    {Array.from({ length: testimonials[activeIndex].stars }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-8 italic text-lg">"{testimonials[activeIndex].quote}"</p>

                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden mr-4 border-2 border-purple-light">
                      <Image
                        src={testimonials[activeIndex].image || "/placeholder.svg"}
                        alt={testimonials[activeIndex].name}
                        width={60}
                        height={60}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{testimonials[activeIndex].name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[activeIndex].position}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-purple-DEFAULT" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-purple-DEFAULT" />
          </button>
        </div>
      </div>
    </section>
  )
}
