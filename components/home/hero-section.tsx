"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Database, BarChart2, Server } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(123, 92, 240, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function initParticles() {
      particles = []
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    function connectParticles() {
      if (!ctx) return
      const maxDistance = 150
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(123, 92, 240, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 10 },
    },
  }

  const featureItems = [
    { icon: <Database className="h-5 w-5" />, text: "Data Architecture" },
    { icon: <Server className="h-5 w-5" />, text: "Cloud Transformation" },
    { icon: <BarChart2 className="h-5 w-5" />, text: "Analytics Solutions" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ background: "transparent" }} />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70 -z-10" />

      <div className="container mx-auto px-6 z-10 pt-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" variants={itemVariants}>
            <span className="text-gray-800">Helping </span>
            <span className="gradient-text">Data-Driven</span>
            <br />
            <span className="text-gray-800">Businesses Unlock</span>
            <br />
            <span className="gradient-text">Greater Value</span>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto" variants={itemVariants}>
            We transform complex data challenges into strategic business advantages through innovative architecture and
            analytics solutions.
          </motion.p>

          <motion.div className="flex flex-wrap justify-center gap-4 mb-12" variants={itemVariants}>
            <Link href="/services">
              <Button
                className="bg-purple-DEFAULT hover:bg-purple-dark text-white px-8 py-6 rounded-md text-lg transition-all duration-300 hover:shadow-lg group"
                style={{ backgroundColor: "#7B5CF0" }} // Explicitly set background color
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="border-2 border-gray-800 bg-white/50 text-gray-800 hover:bg-white px-8 py-6 rounded-md text-lg transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-6 md:gap-12" variants={itemVariants}>
            {featureItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 + index * 0.2 }}
              >
                <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm">{item.icon}</div>
                <span className="text-gray-800 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="relative h-[2px] bg-gradient-to-r from-transparent via-purple-DEFAULT/50 to-transparent">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-DEFAULT" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
