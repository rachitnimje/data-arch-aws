"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Blog } from "@/lib/supabase"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/blogs/${params.slug}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found")
          }
          throw new Error(`Failed to fetch blog: ${response.status}`)
        }

        const data = await response.json()
        setBlog(data)
      } catch (err) {
        console.error("Error fetching blog:", err)
        setError(err instanceof Error ? err.message : "Failed to load blog post")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchBlog()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {error === "Blog post not found" ? "Blog Post Not Found" : "Error"}
          </h1>
          <p className="text-gray-600 mb-8">
            {error === "Blog post not found"
              ? "The blog post you're looking for doesn't exist or has been removed."
              : "There was an error loading this blog post. Please try again later."}
          </p>
          <Link href="/blogs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blogs" className="inline-flex items-center text-gray-600 hover:text-purple-DEFAULT mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{blog.title}</h1>

              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8">
                <div className="flex items-center mr-6 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="bg-purple-light/20 text-purple-dark px-3 py-1 rounded-full text-xs font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>

              {blog.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={blog.featured_image || "/placeholder.svg"}
                    alt={blog.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none mb-8">
                {/* Render the blog content - in a real app, you might want to use a markdown renderer */}
                <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br />") }} />
              </div>

              {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-8">
                  <h3 className="text-lg font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <div key={i} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        <Tag className="h-4 w-4 mr-1" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
