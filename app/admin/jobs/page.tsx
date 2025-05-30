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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import type { Job } from "@/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingAnimation } from "@/components/loading-animation";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalTitle, setErrorModalTitle] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load job listings");
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

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${jobToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("Delete response:", response.status, data);

      if (!response.ok) {
        // Check for foreign key constraint violation
        if (data.code === "FOREIGN_KEY_CONSTRAINT") {
          setErrorModalTitle("Cannot Delete Job");
          setErrorModalMessage(
            data.message ||
              "This job has associated applications and cannot be deleted."
          );
          setShowErrorModal(true);
          setDeleteModalOpen(false);
          setJobToDelete(null);
          return;
        }

        throw new Error(
          `Failed to delete job: ${data.error || response.status}`
        );
      }

      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));

      toast({
        title: "Job deleted",
        description: "The job post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const handleStatusToggle = async (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;

    const newStatus = job.status === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update job status: ${response.status}`);
      }

      // Update the local state
      setJobs(
        jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
      );

      toast({
        title: "Status updated",
        description: "The job status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus ? job.status === filterStatus : true;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <Link href="/admin/jobs/new">
          <Button className="text-purple-dark font-bold bg-white border-2 border-purple-dark hover:bg-purple-dark hover:text-white">
            <Plus strokeWidth={3} size={32} /> Add New Job
          </Button>
        </Link>
      </div>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {errorModalTitle}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {errorModalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowErrorModal(false)}>Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        itemDetails={
          jobToDelete && (
            <div className="space-y-2">
              <p><strong>Title:</strong> {jobToDelete.title}</p>
              <p><strong>Department:</strong> {jobToDelete.department}</p>
              <p><strong>Location:</strong> {jobToDelete.location}</p>
              <p><strong>Posted on:</strong> {new Date(jobToDelete.created_at).toLocaleDateString()}</p>
            </div>
          )
        }
        confirmButtonText="Delete Job"
        isDeleting={isDeleting}
      />

      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                onClick={() => setFilterStatus(null)}
                className="whitespace-nowrap"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                className="whitespace-nowrap"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                onClick={() => setFilterStatus("inactive")}
                className="whitespace-nowrap"
              >
                Inactive
              </Button>
            </div>
          </div>

          {isLoading ? (
            <LoadingAnimation />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">{error}</p>
              <Button className="mt-4" onClick={fetchJobs}>
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
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center">
                        Department
                        {sortField === "department" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location
                        {sortField === "location" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === "type" &&
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
                        Posted Date
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
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{job.title}</td>
                        <td className="py-3 px-4">{job.department}</td>
                        <td className="py-3 px-4">{job.location}</td>
                        <td className="py-3 px-4">{job.type}</td>
                        <td className="py-3 px-4">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              job.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/careers/${job.id}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/jobs/${job.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusToggle(job.id)}
                            >
                              <div
                                className={`h-4 w-8 rounded-full relative ${
                                  job.status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`h-3 w-3 bg-white rounded-full absolute top-0.5 transition-all ${
                                    job.status === "active"
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
                              onClick={() => handleDeleteClick(job)}
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
                        colSpan={7}
                        className="py-6 text-center text-gray-500"
                      >
                        No jobs found matching your criteria
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