"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { Blog } from "@/lib/schema";
import { LoadingAnimation } from "@/components/loading-animation";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

const PAGE_SIZE = 10;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Blog | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    setIsTableMissing(false);

    try {
      const response = await fetch("/api/blogs");

      // Check if the table is missing based on the special header
      if (response.headers.get("X-Table-Missing") === "true") {
        setIsTableMissing(true);
        setBlogs([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);

        // Check if the error message indicates a missing table
        if (
          errorData.error &&
          errorData.error.includes("relation") &&
          errorData.error.includes("does not exist")
        ) {
          setIsTableMissing(true);
          setBlogs([]);
          setIsLoading(false);
          return;
        }

        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);

      // Check if the error message indicates a missing table
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load blog posts";
      if (
        errorMessage.includes("relation") &&
        errorMessage.includes("does not exist")
      ) {
        setIsTableMissing(true);
      } else {
        setError(errorMessage);
      }

      setBlogs([]);

      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Function to filter and sort blogs client-side (matching original functionality)
  const filteredBlogs = blogs
    .filter((blog) => {
      if (!searchTerm) return true;

      return (
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const fieldA = a[sortField] as string | number | null;
      const fieldB = b[sortField] as string | number | null;

      // Handle null values (put them at the end)
      if (fieldA === null && fieldB === null) return 0;
      if (fieldA === null) return sortDirection === "asc" ? 1 : -1;
      if (fieldB === null) return sortDirection === "asc" ? -1 : 1;

      // Compare values based on sort direction
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Handle sort column click
  const handleSort = (field: keyof Blog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (blog: Blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  // Handle deleting a blog post
  const handleDelete = async () => {
    if (!blogToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${blogToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete blog");
      }

      // Update local state to remove the deleted blog
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));

      toast({
        title: "Blog deleted",
        description: "The blog post has been successfully deleted.",
      });
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggling blog status
  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    setIsMutating(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update blog status");
      }

      // Update local state to reflect the status change
      setBlogs(
        blogs.map((blog) =>
          blog.id === id
            ? { ...blog, status: newStatus as "published" | "draft" }
            : blog
        )
      );

      toast({
        title: "Status updated",
        description: "The blog status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast({
        title: "Error",
        description: "Failed to update blog status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and New Blog button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Link href="/admin/blogs/new">
          <Button className="text-purple-dark font-bold bg-white border-2 border-purple-dark hover:bg-purple-dark hover:text-white">
            <Plus strokeWidth={3} size={32} /> New Blog Post
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isDeleting={isDeleting}
        itemDetails={
          blogToDelete && (
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Title:</span> {blogToDelete.title}
              </div>
              <div>
                <span className="font-semibold">Author:</span> {blogToDelete.author}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {blogToDelete.category}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  blogToDelete.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {blogToDelete.status}
                </span>
              </div>
            </div>
          )
        }
      />

      {/* Main content card */}
      <Card>
        <CardContent className="pt-6">
          {/* Search bar */}
          <div className="flex mb-6 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search blogs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        {sortField === "title" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("author")}
                    >
                      <div className="flex items-center">
                        Author
                        {sortField === "author" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === "category" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "created_at" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{blog.title}</td>
                        <td className="py-3 px-4">{blog.author}</td>
                        <td className="py-3 px-4">{blog.category}</td>
                        <td className="py-3 px-4">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="View Blog"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Edit Blog"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusToggle(blog.id, blog.status)
                              }
                              disabled={isMutating}
                              title={
                                blog.status === "published"
                                  ? "Unpublish"
                                  : "Publish"
                              }
                            >
                              <div
                                className={`h-4 w-8 rounded-full relative ${
                                  blog.status === "published"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`h-3 w-3 bg-white rounded-full absolute top-0.5 transition-all ${
                                    blog.status === "published"
                                      ? "right-0.5"
                                      : "left-0.5"
                                  }`}
                                ></div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openDeleteModal(blog)}
                              disabled={isMutating}
                              title="Delete Blog"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-gray-500"
                      >
                        {isTableMissing ? (
                          <div className="flex flex-col items-center gap-2">
                            <p>Database tables are not set up yet.</p>
                            <Button
                              onClick={() => router.push("/admin/settings")}
                              variant="outline"
                              className="mt-2"
                            >
                              Go to Settings
                            </Button>
                          </div>
                        ) : error ? (
                          <div>Error loading blogs: {error}</div>
                        ) : (
                          <div>
                            No blogs found. Create your first blog post!
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}