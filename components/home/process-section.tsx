"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ClipboardList, Search, LineChart, Settings, Zap } from "lucide-react"

const processSteps = [
  {
    title: "Discovery",
    description: "We analyze your current data infrastructure and business goals",
    icon: <Search className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Strategy",
    description: "We develop a tailored data strategy aligned with your objectives",
    icon: <ClipboardList className="h-10 w-10 text-purple-DEFAULT" />,
  },
  {
    title: "Implementation",
    description: "Our experts deploy solutions with minimal disruption",
    icon: <Settings className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Optimization",
    description: "Continuous improvement to maximize performance and ROI",
    icon: <LineChart className="h-10 w-10 text-purple-DEFAULT" />,
  },
  {
    title: "Results",
    description: "Achieve faster insights, better decisions, and greater value",
    icon: <Zap className="h-10 w-10 text-blue-DEFAULT" />,
  },
]

export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20 stats-section" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our proven methodology ensures successful data transformations with measurable results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 relative z-10">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card-gradient p-6 rounded-lg text-center group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
            >
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-white p-4 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT mx-auto group-hover:w-1/2 transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
