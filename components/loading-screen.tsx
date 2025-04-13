"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 border-4 border-t-purple-DEFAULT border-r-transparent border-b-blue-DEFAULT border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </motion.div>
    </div>
  )
}
