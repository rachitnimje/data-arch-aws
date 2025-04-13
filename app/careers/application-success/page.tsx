"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"

export default function ApplicationSuccessPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-gradient rounded-lg p-8 shadow-lg max-w-2xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h1>

            <p className="text-gray-600 mb-8">
              Thank you for applying to DataArch. We've received your application and will review it shortly. Our team
              will contact you if your qualifications match our requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers">
                <Button variant="outline" className="flex items-center">
                  View More Jobs
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
