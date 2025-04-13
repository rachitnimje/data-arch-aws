"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  created_at: string;
  status: string;
}

interface ApiResponse {
  data: ContactSubmission[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch contact submissions: ${response.status}`
        );
      }

      const responseData: ContactSubmission[] | ApiResponse =
        await response.json();

      // Handle both array response and object with data property
      let submissionsData: ContactSubmission[] = [];

      if (Array.isArray(responseData)) {
        // Handle direct array response
        submissionsData = responseData;
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData &&
        Array.isArray(responseData.data)
      ) {
        // Handle { data: [...] } response format
        submissionsData = responseData.data;
      } else {
        // If we can't determine the format, log it and set an empty array
        console.error("Unexpected API response format:", responseData);
        submissionsData = [];
      }

      setSubmissions(submissionsData);
    } catch (err) {
      console.error("Error fetching contact submissions:", err);
      setError("Failed to load contact submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this contact submission?")) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete submission: ${response.status}`);
        }

        setSubmissions(submissions.filter((sub) => sub.id !== id));

        toast({
          title: "Submission deleted",
          description: "The contact submission has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting submission:", error);
        toast({
          title: "Error",
          description: "Failed to delete submission. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (submissionId: number, newStatus: string) => {
    setIsUpdatingStatus(submissionId);
    try {
      // Optimistically update the UI
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: newStatus } : sub
      ));

      const response = await fetch(`/api/contact/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setSubmissions(submissions);
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update status: ${response.status}`);
      }

      toast({
        title: "Status updated",
        description: `Submission status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating submission status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const filteredSubmissions =
    submissions && Array.isArray(submissions)
      ? submissions
          .filter((sub) => {
            const matchesSearch =
              sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sub.message.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus
              ? sub.status === filterStatus
              : true;
            return matchesSearch && matchesStatus;
          })
          .sort((a, b) => {
            if (!sortField) return 0;

            // Safe access to potentially undefined properties
            const fieldA =
              sortField in a ? a[sortField as keyof typeof a] : undefined;
            const fieldB =
              sortField in b ? b[sortField as keyof typeof b] : undefined;

            // Handle cases where values might be undefined
            if (fieldA === undefined && fieldB === undefined) return 0;
            if (fieldA === undefined) return sortDirection === "asc" ? -1 : 1;
            if (fieldB === undefined) return sortDirection === "asc" ? 1 : -1;

            // Compare when both values are defined
            if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
            if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
            return 0;
          })
      : [];

  const statusOptions = ["new", "read", "replied", "archived"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
      </div>

      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search submissions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                onClick={() => setFilterStatus(null)}
                className="whitespace-nowrap"
              >
                All
              </Button>
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className="whitespace-nowrap"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">{error}</p>
              <Button className="mt-4" onClick={fetchSubmissions}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "name" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Email
                        {sortField === "email" &&
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
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{submission.name}</td>
                        <td className="py-3 px-4">
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {submission.email}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={submission.status}
                            onChange={(e) =>
                              handleStatusChange(submission.id, e.target.value)
                            }
                            className="px-2 py-1 rounded text-sm border bg-gray-100 text-gray-800 border-gray-200"
                            disabled={isUpdatingStatus === submission.id}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/admin/contact/${submission.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-gray-500"
                      >
                        No contact submissions found matching your criteria
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
