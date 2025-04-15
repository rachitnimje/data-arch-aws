"use client"

import { useRef, useState, useEffect } from "react"
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
    color: "bg-blue-light/20",
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
    color: "bg-purple-light/20",
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
  const [isMobile, setIsMobile] = useState(false)

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Simple fade-in animation for the container
  const containerAnimation = {
    initial: { opacity: 0 },
    animate: isInView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.5 }
  }

  // Simple fade-in animation for the header
  const headerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.5 }
  }

  // Simple card animation that works well on both mobile and desktop
  const cardAnimation = (index : number) => ({
    initial: { opacity: 0, y: 15 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 },
    transition: { duration: 0.4, delay: index * 0.1 }
  })

  // Optimized animation for details expansion
  const detailsAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { 
      height: { duration: 0.25 },
      opacity: { duration: 0.2 }
    }
  }

  return (
    <section className="py-16 md:py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          {...headerAnimation}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Why choose <span className="gradient-text">DataArch?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of data solutions helps businesses unlock the full potential of their data assets
          </p>
        </motion.div>

        <motion.div
          {...containerAnimation}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              {...cardAnimation(index)}
              className={`service-card rounded-lg p-6 ${service.color} backdrop-blur-sm border border-white/50 hover:border-purple-light/50 transition-colors duration-300 shadow-md cursor-pointer relative`}
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
                    {...detailsAnimation}
                    className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                  >
                    <ul className="space-y-2">
                      {service.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start"
                        >
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Simple hover effect that works well on all devices */}
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

