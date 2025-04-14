"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/lib/schema";
import dynamic from "next/dynamic";

// Dynamically import the BlogCard component
const BlogCard = dynamic(() => import("@/components/blogs/blog-card"), {
  loading: () => <BlogCardSkeleton />,
  ssr: true,
});

// Skeleton component for blog cards
function BlogCardSkeleton() {
  return (
    <div className="card-gradient rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
          <div className="h-4 w-20 bg-gray-200 rounded mr-4"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Memoize fetchBlogs to prevent unnecessary re-renders
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Use a cache-busting parameter to avoid stale data
      const cacheBuster = new Date().getTime()
      const response = await fetch(`/api/blogs?status=published&_=${cacheBuster}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`)
      }

      const data = await response.json()

      // Validate that we received an array
      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data)
        throw new Error("Received invalid data format from server")
      }

      setBlogPosts(data)

      // Extract unique categories
      const uniqueCategories = ["All", ...Array.from(new Set(data.map((post) => post.category).filter(Boolean)))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching blogs:", err)
      setError("Failed to load blog posts. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs, retryCount]);

  // Memoize filtered posts to avoid recalculation on every render
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            DataArch <span className="gradient-text">Blog</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Insights, best practices, and expert perspectives on data
            architecture, cloud transformation, and analytics.
          </motion.p>

          <motion.div
            className="max-w-md mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 py-6 rounded-full border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`rounded-full px-4 py-2 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT text-white"
                    : "border-gray-300 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">{error}</p>
              <Button className="mt-4" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Suspense key={post.id} fallback={<BlogCardSkeleton />}>
                  <BlogCard post={post} index={index} />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No articles found matching your search criteria.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
