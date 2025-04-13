"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    setIsSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Contact <span className="gradient-text">DataArch</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-DEFAULT rounded-full p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-0">
              <div className="p-6 md:col-span-3">
                <p className="text-gray-600 mb-6">
                  Ready to transform your data strategy? Get in touch with our experts now!
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    placeholder="Full name"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <Input
                    type="text"
                    placeholder="Company"
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <Textarea
                    placeholder="How can we help you?"
                    className="col-span-1 md:col-span-2 min-h-[150px] bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    required
                  />
                  <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-800">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white transition-all duration-300 hover:shadow-lg group"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-gradient-to-br from-purple-light/30 to-blue-light/30 p-6 md:col-span-2 rounded-r-lg">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-purple-DEFAULT mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <a
                        href="mailto:sales@dataarch.co"
                        className="text-gray-600 hover:text-purple-DEFAULT transition-colors"
                      >
                        sales@dataarch.co
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-DEFAULT mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <a href="tel:+919960743850" className="text-gray-600 hover:text-blue-DEFAULT transition-colors">
                        +91-9960743850
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-purple-DEFAULT mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Office</p>
                      <p className="text-gray-600">
                        New Sanghavi Pimpri-Chinchwad,
                        <br />
                        Maharashtra 411027
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Business Hours</h4>
                  <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
