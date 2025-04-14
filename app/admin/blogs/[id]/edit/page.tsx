// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "@/components/ui/use-toast"
// import Link from "next/link"

// export default function EditBlogPage() {
//   const params = useParams()
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   const [formData, setFormData] = useState({
//     title: "",
//     excerpt: "",
//     content: "",
//     author: "",
//     category: "",
//     tags: "",
//     featuredImage: "",
//     status: "",
//   })

//   useEffect(() => {
//     const fetchBlog = async () => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/blogs/${params.id}`)

//         if (!response.ok) {
//           throw new Error(`Failed to fetch blog: ${response.status}`)
//         }

//         const blog = await response.json()

//         setFormData({
//           title: blog.title,
//           excerpt: blog.excerpt || "",
//           content: blog.content,
//           author: blog.author || "",
//           category: blog.category,
//           tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
//           featuredImage: blog.featured_image || "",
//           status: blog.status,
//         })
//       } catch (error) {
//         console.error("Error fetching blog:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load blog post. Please try again.",
//           variant: "destructive",
//         })
//         router.push("/admin/blogs")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id) {
//       fetchBlog()
//     }
//   }, [params.id, router])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       // Convert tags string to array
//       const tagsArray = formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : []

//       const response = await fetch(`/api/blogs/${params.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           excerpt: formData.excerpt,
//           content: formData.content,
//           author: formData.author,
//           category: formData.category,
//           tags: tagsArray,
//           featured_image: formData.featuredImage,
//           status: formData.status,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.error || `API error: ${response.status}`)
//       }

//       toast({
//         title: "Blog post updated",
//         description: "The blog post has been successfully updated.",
//       })

//       router.push("/admin/blogs")
//     } catch (error) {
//       console.error("Error updating blog post:", error)
//       toast({
//         title: "Error",
//         description: "There was an error updating the blog post. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="flex items-center mb-6">
//         <Link href="/admin/blogs">
//           <Button variant="outline" className="mr-4">
//             <ArrowLeft className="h-4 w-4 mr-2" /> Back
//           </Button>
//         </Link>
//         <h1 className="text-2xl font-bold">Edit Blog Post</h1>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Blog Post Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                 Title *
//               </label>
//               <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
//             </div>

//             <div>
//               <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
//                 Excerpt *
//               </label>
//               <textarea
//                 id="excerpt"
//                 name="excerpt"
//                 value={formData.excerpt}
//                 onChange={handleChange}
//                 className="w-full min-h-[80px] p-2 border rounded-md"
//                 placeholder="A brief summary of the blog post"
//                 required
//               ></textarea>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
//                   Author *
//                 </label>
//                 <Input
//                   id="author"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   placeholder="Author name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                   Category *
//                 </label>
//                 <Input
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   placeholder="e.g., Data Architecture, Cloud, Analytics"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                   Status *
//                 </label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded-md"
//                   required
//                 >
//                   <option value="published">Published</option>
//                   <option value="draft">Draft</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
//                 Tags
//               </label>
//               <Input
//                 id="tags"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="Separate tags with commas (e.g., AI, Data Lakes, Machine Learning)"
//               />
//             </div>

//             <div>
//               <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
//                 Featured Image URL
//               </label>
//               <Input
//                 id="featuredImage"
//                 name="featuredImage"
//                 value={formData.featuredImage}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Enter a URL for the featured image or use "/placeholder.svg?height=400&width=600" for a placeholder
//               </p>
//             </div>

//             <div>
//               <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
//                 Content *
//               </label>
//               <textarea
//                 id="content"
//                 name="content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 className="w-full min-h-[300px] p-2 border rounded-md"
//                 placeholder="Write your blog post content here..."
//                 required
//               ></textarea>
//             </div>

//             <div className="flex justify-end gap-4">
//               <Link href="/admin/blogs">
//                 <Button type="button" variant="outline">
//                   Cancel
//                 </Button>
//               </Link>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Updating..." : "Update Blog Post"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Blog } from "@/lib/schema"

// Form state type derived from Blog interface
interface FormState {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string
  featuredImage: string
  status: "published" | "draft"
}

// Initial form state
const initialFormState: FormState = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  featuredImage: "",
  status: "published",
}

export default function EditBlogPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [originalBlog, setOriginalBlog] = useState<Blog | null>(null)

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchBlog = useCallback(async () => {
    if (!params.id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.status}`)
      }

      const blog: Blog = await response.json()
      setOriginalBlog(blog)

      // Map the API response to our form state
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        tags: blog.tags.join(", "),
        featuredImage: blog.featured_image || "",
        status: blog.status,
      })
    } catch (error) {
      console.error("Error fetching blog:", error)
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      })
      router.push("/admin/blogs")
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    const name = 'target' in e ? e.target.name : e.name
    const value = 'target' in e ? e.target.value : e.value
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Convert tags string to array
      const tagsArray = formData.tags ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []

      // Show optimistic UI update
      toast({
        title: "Saving changes...",
        description: "Your changes are being saved.",
      })

      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          category: formData.category,
          tags: tagsArray,
          featured_image: formData.featuredImage || null,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      // Update success
      toast({
        title: "Blog post updated",
        description: "The blog post has been successfully updated.",
      })

      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error updating blog post:", error)
      toast({
        title: "Error",
        description: "There was an error updating the blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if any changes were made
  const hasChanges = originalBlog && (
    formData.title !== originalBlog.title ||
    formData.excerpt !== originalBlog.excerpt ||
    formData.content !== originalBlog.content ||
    formData.author !== originalBlog.author ||
    formData.category !== originalBlog.category ||
    formData.featuredImage !== (originalBlog.featured_image || "") ||
    formData.status !== originalBlog.status ||
    formData.tags !== originalBlog.tags.join(", ")
  )

  // Show skeleton UI during loading
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mr-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/admin/blogs">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="min-h-[80px]"
                placeholder="A brief summary of the blog post"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Data Architecture, Cloud, Analytics"
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange(value as "published" | "draft", "status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Separate tags with commas (e.g., AI, Data Lakes, Machine Learning)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium mb-1">
                Featured Image URL
              </label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL for the featured image or use "/placeholder.svg?height=400&width=600" for a placeholder
              </p>
              {formData.featuredImage && (
                <div className="mt-2">
                  <p className="text-xs mb-1">Preview:</p>
                  <div className="h-24 w-24 relative rounded overflow-hidden border">
                    <img 
                      src={formData.featuredImage || "/placeholder.svg?height=400&width=600"}
                      alt="Preview" 
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[300px]"
                placeholder="Write your blog post content here..."
                required
              />
            </div>

            {originalBlog && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date(originalBlog.updated_at).toLocaleString()}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Link href="/admin/blogs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting || !hasChanges}
                className={!hasChanges ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting ? "Updating..." : "Update Blog Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}