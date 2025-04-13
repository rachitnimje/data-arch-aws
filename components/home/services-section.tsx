"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Database, Cloud, Cpu, BarChart3, ChevronRight, Check } from "lucide-react"

const services = [
  {
    title: "Cloud Transformation",
    description: "Seamless strategy, migration & management",
    icon: <Cloud className="h-8 w-8 text-blue-DEFAULT" />,
    color: "bg-blue-light/20",
    details: [
      "Accelerate cloud adoption with our proven methodology",
      "Minimize disruption during migration",
      "Optimize cloud resources for cost efficiency",
      "Implement robust security and governance",
      "Continuous monitoring and optimization",
    ],
  },
  {
    title: "AI-Ready Data Lakes",
    description: "Secure storage for structured & unstructured data",
    icon: <Database className="h-8 w-8 text-purple-DEFAULT" />,
    color: "bg-purple-light/20",
    details: [
      "Centralize all your data in one accessible location",
      "Scale seamlessly as your data grows",
      "Enable advanced analytics and machine learning",
      "Maintain data quality and governance",
      "Secure and compliant data storage",
    ],
  },
  {
    title: "Smart Data Pipelines",
    description: "Scalable solutions for real-time & big data",
    icon: <BarChart3 className="h-8 w-8 text-purple-DEFAULT" />,
    color: "bg-purple-light/20",
    details: [
      "Process data in real-time for immediate insights",
      "Automate data transformation and enrichment",
      "Integrate with existing systems seamlessly",
      "Handle any data volume with elastic scaling",
      "Monitor and troubleshoot with advanced observability",
    ],
  },
  {
    title: "Future-Ready Tech",
    description: "Automate, optimize & accelerate growth",
    icon: <Cpu className="h-8 w-8 text-blue-DEFAULT" />,
    color: "bg-blue-light/20",
    details: [
      "Stay ahead with cutting-edge data technologies",
      "Implement AI and machine learning capabilities",
      "Automate routine data tasks and workflows",
      "Adapt quickly to changing business needs",
      "Future-proof your data architecture",
    ],
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeService, setActiveService] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why choose <span className="gradient-text">DataArch?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of data solutions helps businesses unlock the full potential of their data assets
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`service-card rounded-lg p-6 ${service.color} backdrop-blur-md border border-white/50 hover:border-purple-light/50 transition-all duration-300 shadow-md cursor-pointer relative overflow-hidden`}
              onClick={() => setActiveService(activeService === index ? null : index)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>{service.icon}</div>
                <ChevronRight
                  className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${
                    activeService === index ? "rotate-90" : ""
                  }`}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              <AnimatePresence>
                {activeService === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <ul className="space-y-2">
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start"
                        >
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gradient overlay effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
