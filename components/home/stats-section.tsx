"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Counter } from "@/components/ui/counter"
import { BarChartIcon as ChartBar, Users, Building } from "lucide-react"

const stats = [
  {
    value: 150,
    label: "Clients",
    suffix: "+",
    icon: <Users className="h-8 w-8 text-blue-DEFAULT" />,
  },
  {
    value: 98,
    label: "Satisfaction",
    suffix: "%",
    icon: <ChartBar className="h-8 w-8 text-purple-DEFAULT" />,
  },
  {
    value: 25,
    label: "Industries",
    suffix: "+",
    icon: <Building className="h-8 w-8 text-blue-DEFAULT" />,
  },
]

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="stats-section py-16 text-gray-800" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Harness the power of data with <span className="gradient-text">DataArch</span>
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Simplify Data Management | Optimize the Cloud | Modernize Your Data Platforms
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center card-gradient p-8 rounded-lg relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index + 0.3 }}
            >
              <div className="absolute right-4 top-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300 z-0">
                {stat.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} duration={1500 + index * 500} />
                </h3>
                <p className="text-xl text-gray-700">{stat.label}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
