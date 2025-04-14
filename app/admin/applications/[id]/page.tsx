"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { JobApplication } from "@/lib/schema";
import { EditLoadingAnimation } from "@/components/loading-animation";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Memoize fetchApplication to prevent recreating on each render
  const fetchApplication = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    setError(null);

    try {
      // Use Promise.all to fetch application data and job details in parallel
      const applicationPromise = fetch(`/api/applications/${params.id}`);

      // Wait for the application data first to get the job_id
      const applicationResponse = await applicationPromise;

      if (!applicationResponse.ok) {
        if (applicationResponse.status === 404) {
          throw new Error("Application not found");
        }
        throw new Error(
          `Failed to fetch application: ${applicationResponse.status}`
        );
      }

      const data = await applicationResponse.json();

      // Set basic application data immediately
      const appData = {
        ...data,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        job_title: "Loading position...",
      };

      setApplication(appData);
      setNotes(data.notes || "");
      setStatus(data.status || "new");

      // If job_id exists, fetch job details in parallel
      if (data.job_id) {
        try {
          const jobResponse = await fetch(`/api/jobs/${data.job_id}`, {
            headers: {
              "Cache-Control": "max-age=600", // Cache for 10 minutes
            },
          });

          if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            setApplication((prev) =>
              prev ? { ...prev, job_title: jobData.title } : null
            );
          } else {
            setApplication((prev) =>
              prev
                ? { ...prev, job_title: "Position details unavailable" }
                : null
            );
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          setApplication((prev) =>
            prev ? { ...prev, job_title: "Position details unavailable" } : null
          );
        }
      } else {
        setApplication((prev) =>
          prev ? { ...prev, job_title: "No position specified" } : null
        );
      }
    } catch (err) {
      console.error("Error fetching application:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load application details"
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleSaveNotes = async () => {
    if (!application) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update notes: ${response.status}`
        );
      }

      setApplication((prev) => (prev ? { ...prev, notes } : null));

      toast({
        title: "Notes saved",
        description: "Application notes have been updated.",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!application || status === newStatus) return; // Avoid unnecessary API calls

    try {
      // Optimistic update
      setStatus(newStatus);
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));

      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Revert optimistic update on error
        setStatus(application.status);
        setApplication((prev) =>
          prev ? { ...prev, status: application.status } : null
        );
        throw new Error(
          errorData.error || `Failed to update status: ${response.status}`
        );
      }

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus.replace(
          "_",
          " "
        )}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApplication = async () => {
    if (!application) return;

    if (
      confirm(
        "Are you sure you want to delete this application? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/applications/${application.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Failed to delete application: ${response.status}`
          );
        }

        toast({
          title: "Application deleted",
          description: "The application has been successfully deleted.",
        });

        router.push("/admin/applications");
      } catch (error) {
        console.error("Error deleting application:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownloadResume = async () => {
    if (!application?.resume_url) return;

    try {
      const res = await fetch(
        `/api/resume-url?key=${encodeURIComponent(application.resume_url)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to get resume URL: ${res.status}`);
      }

      const { url } = await res.json();
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <EditLoadingAnimation />;
  }

  if (error || !application) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          {error || "Application not found"}
        </p>
        <Link href="/admin/applications">
          <Button className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const statusOptions = [
    "new",
    "in_review",
    "interviewed",
    "hired",
    "rejected",
  ];

  // Preprocess formatted data to avoid recalculation in render
  const formattedDate = new Date(application.created_at).toLocaleDateString();
  const statusLabel = (option: string) =>
    option.replace("_", " ").charAt(0).toUpperCase() +
    option.replace("_", " ").slice(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/applications">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>
        <div className="flex gap-2">
          {application.resume_url && (
            <Button variant="outline" onClick={handleDownloadResume}>
              <Download className="h-4 w-4 mr-2" /> Download Resume
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{`${application.first_name} ${application.last_name}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${application.email}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {application.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${application.phone}`}
                        className="font-medium"
                      >
                        {application.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-4">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      {application.job_id ? (
                        <Link
                          href={`/admin/jobs/${application.job_id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {application.job_title}
                        </Link>
                      ) : (
                        <p className="font-medium">{application.job_title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Applied Date</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  {application.current_company && (
                    <div className="flex items-start mb-4">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Current Company</p>
                        <p className="font-medium">
                          {application.current_company}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[200px] p-3 border rounded-md"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this applicant..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveNotes} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusOptions.map((option) => (
                  <Button
                    key={option}
                    variant={status === option ? "default" : "outline"}
                    className={`w-full justify-start ${
                      option === "hired" && status === option
                        ? "bg-green-600 hover:bg-green-700"
                        : option === "rejected" && status === option
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                    onClick={() => handleStatusChange(option)}
                  >
                    {statusLabel(option)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      application.email
                    )}`;
                    window.open(mailtoUrl, "_blank");
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" /> Send Email
                </Button>
                <Button
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="outline"
                  onClick={handleDeleteApplication}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />{" "}
                  {isDeleting ? "Deleting..." : "Delete Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
