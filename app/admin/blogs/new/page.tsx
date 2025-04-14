"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form state interface derived from Blog interface
interface FormState {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  featuredImage: string;
  status: "published" | "draft";
}

// Initial form state with default values
const initialFormState: FormState = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  tags: "",
  featuredImage: "",
  status: "draft",
};

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  // Form change handlers
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const name = "target" in e ? e.target.name : e.name;
    const value = "target" in e ? e.target.value : e.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation function
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.excerpt.trim()) {
      toast({
        title: "Missing excerpt",
        description: "Please enter an excerpt for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter content for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.author.trim()) {
      toast({
        title: "Missing author",
        description: "Please enter an author for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Missing category",
        description: "Please enter a category for your blog post.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Show optimistic toast while submitting
      toast({
        title: "Creating blog post...",
        description: "Your blog post is being created.",
      });

      // Convert tags string to array and filter out empty tags
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const response = await fetch("/api/blogs", {
        method: "POST",
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
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      toast({
        title: "Success!",
        description: "The blog post has been successfully created.",
      });

      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description:
          "There was an error creating the blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has any content to enable/disable the submit button
  const hasContent =
    formData.title.trim() !== "" ||
    formData.excerpt.trim() !== "" ||
    formData.content.trim() !== "" ||
    formData.author.trim() !== "" ||
    formData.category.trim() !== "";

  return (
    <div className="container mx-auto max-6xl">
      <div className="flex items-center mb-6">
        <Link href="/admin/blogs">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
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
                placeholder="Enter a compelling title"
                required
                className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium mb-1"
              >
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
                <label
                  htmlFor="author"
                  className="block text-sm font-medium mb-1"
                >
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
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                >
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
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange(value as "published" | "draft", "status")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
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
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <div>
              <label
                htmlFor="featuredImage"
                className="block text-sm font-medium mb-1"
              >
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
                Enter a URL for the featured image or use
                "/placeholder.svg?height=400&width=600" for a placeholder
              </p>
              {formData.featuredImage && (
                <div className="mt-2">
                  <p className="text-xs mb-1">Preview:</p>
                  <div className="h-24 w-24 relative rounded overflow-hidden border">
                    <img
                      src={
                        formData.featuredImage ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt="Preview"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=400&width=600";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
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

            <div className="flex justify-end gap-4">
              <Link href="/admin/blogs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !hasContent}
                className={!hasContent ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting
                  ? "Creating..."
                  : formData.status === "published"
                  ? "Publish Blog Post"
                  : "Save as Draft"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
