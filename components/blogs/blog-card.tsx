"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag, ArrowRight } from "lucide-react"
import type { Blog } from "@/lib/supabase"

interface BlogCardProps {
  post: Blog
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      className="card-gradient rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden">
        <Image
          src={post.featured_image || "/placeholder.svg?height=400&width=600"}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          priority={index < 3} // Prioritize loading for the first 3 images
        />
        <div className="absolute top-4 right-4 bg-white/90 text-purple-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
          {post.category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">{new Date(post.created_at).toLocaleDateString()}</span>
          <User className="h-4 w-4 mr-1" />
          <span>{post.author}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 hover:text-purple-DEFAULT transition-colors">
          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags &&
            Array.isArray(post.tags) &&
            post.tags.slice(0, 3).map((tag, i) => (
              <div key={i} className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
        </div>
        <Link
          href={`/blogs/${post.slug}`}
          className="inline-flex items-center text-purple-DEFAULT hover:text-purple-dark font-medium"
        >
          Read More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  )
}
