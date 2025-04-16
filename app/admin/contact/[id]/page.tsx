// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   Calendar,
//   Building,
//   MessageSquare,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { toast } from "@/components/ui/use-toast";
// import { ContactSubmission } from "@/lib/schema";
// import { EditLoadingAnimation } from "@/components/loading-animation";

// export default function ContactDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [submission, setSubmission] = useState<ContactSubmission | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     fetchSubmission();
//   }, []);

//   const fetchSubmission = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/contact/${params.id}`);

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error("Contact submission not found");
//         }
//         throw new Error(
//           `Failed to fetch contact submission: ${response.status}`
//         );
//       }

//       const data = await response.json();
//       setSubmission(data);
//       setStatus(data.status || "new");
//     } catch (err) {
//       console.error("Error fetching contact submission:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to load contact submission details"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (newStatus: string) => {
//     if (!submission || isUpdating) return;

//     setIsUpdating(true);
//     try {
//       // Optimistically update the UI
//       setStatus(newStatus);

//       const response = await fetch(`/api/contact/${submission.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//         credentials: "include", // Include cookies in the request
//       });

//       if (!response.ok) {
//         // Revert optimistic update on error
//         setStatus(submission.status);
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error || `Failed to update status: ${response.status}`
//         );
//       }

//       const responseData = await response.json();
//       // Update the submission with the response data
//       setSubmission(responseData);

//       toast({
//         title: "Status updated",
//         description: `Submission status changed to ${newStatus}.`,
//       });
//     } catch (error) {
//       console.error("Error updating submission status:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Failed to update status. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteSubmission = async () => {
//     if (!submission) return;

//     if (
//       confirm(
//         "Are you sure you want to delete this contact submission? This action cannot be undone."
//       )
//     ) {
//       setIsDeleting(true);
//       try {
//         const response = await fetch(`/api/contact/${submission.id}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.error || `Failed to delete submission: ${response.status}`
//           );
//         }

//         toast({
//           title: "Submission deleted",
//           description: "The contact submission has been successfully deleted.",
//         });

//         router.push("/admin/contact");
//       } catch (error) {
//         console.error("Error deleting submission:", error);
//         toast({
//           title: "Error",
//           description:
//             error instanceof Error
//               ? error.message
//               : "Failed to delete submission. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };

//   if (loading) {
//     return <EditLoadingAnimation />;
//   }

//   if (error || !submission) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-lg text-gray-600">
//           {error || "Contact submission not found"}
//         </p>
//         <Link href="/admin/contact">
//           <Button className="mt-4">Back to Contact Submissions</Button>
//         </Link>
//       </div>
//     );
//   }

//   const statusOptions = ["new", "read", "replied", "archived"];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <Link href="/admin/contact">
//             <Button variant="outline" className="mr-4">
//               <ArrowLeft className="h-4 w-4 mr-2" /> Back
//             </Button>
//           </Link>
//           <h1 className="text-2xl font-bold">Contact Submission Details</h1>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Contact Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <div className="flex items-start mb-4">
//                     <MessageSquare className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-500">Name</p>
//                       <p className="font-medium">{submission.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start mb-4">
//                     <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-500">Email</p>
//                       <a
//                         href={`mailto:${submission.email}`}
//                         className="font-medium text-blue-600 hover:underline"
//                       >
//                         {submission.email}
//                       </a>
//                     </div>
//                   </div>
//                   {submission.phone && (
//                     <div className="flex items-start mb-4">
//                       <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-500">Phone</p>
//                         <a
//                           href={`tel:${submission.phone}`}
//                           className="font-medium"
//                         >
//                           {submission.phone}
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   {submission.company && (
//                     <div className="flex items-start mb-4">
//                       <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-500">Company</p>
//                         <p className="font-medium">{submission.company}</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-start mb-4">
//                     <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-500">Submitted Date</p>
//                       <p className="font-medium">
//                         {new Date(submission.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Message</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
//                 {submission.message}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div>
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Submission Status</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {statusOptions.map((option) => (
//                   <Button
//                     key={option}
//                     variant={status === option ? "default" : "outline"}
//                     className={`w-full justify-start ${
//                       option === "completed" && status === option
//                         ? "bg-green-600 hover:bg-green-700"
//                         : option === "archived" && status === option
//                         ? "bg-gray-600 hover:bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={() => handleStatusChange(option)}
//                     disabled={isUpdating}
//                   >
//                     {option.replace("_", " ").charAt(0).toUpperCase() +
//                       option.replace("_", " ").slice(1)}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Actions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button
//                   className="w-full"
//                   variant="outline"
//                   onClick={() => {
//                     const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
//                       submission.email
//                     )}`;
//                     window.open(mailtoUrl, "_blank");
//                   }}
//                 >
//                   <Mail className="h-4 w-4 mr-2" /> Reply via Email
//                 </Button>
//                 <Button
//                   className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
//                   variant="outline"
//                   onClick={handleDeleteSubmission}
//                   disabled={isDeleting}
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />{" "}
//                   {isDeleting ? "Deleting..." : "Delete Submission"}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { ContactSubmission } from "@/lib/schema";
import { EditLoadingAnimation } from "@/components/loading-animation";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, []);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Contact submission not found");
        }
        throw new Error(
          `Failed to fetch contact submission: ${response.status}`
        );
      }

      const data = await response.json();
      setSubmission(data);
      setStatus(data.status || "new");
    } catch (err) {
      console.error("Error fetching contact submission:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load contact submission details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!submission || isUpdating) return;

    setIsUpdating(true);
    try {
      // Optimistically update the UI
      setStatus(newStatus);

      const response = await fetch(`/api/contact/${submission.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setStatus(submission.status);
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update status: ${response.status}`
        );
      }

      const responseData = await response.json();
      // Update the submission with the response data
      setSubmission(responseData);

      toast({
        title: "Status updated",
        description: `Submission status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating submission status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!submission) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contact/${submission.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete submission: ${response.status}`
        );
      }

      toast({
        title: "Submission deleted",
        description: "The contact submission has been successfully deleted.",
      });

      router.push("/admin/contact");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete submission. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <EditLoadingAnimation />;
  }

  if (error || !submission) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          {error || "Contact submission not found"}
        </p>
        <Link href="/admin/contact">
          <Button className="mt-4">Back to Contact Submissions</Button>
        </Link>
      </div>
    );
  }

  const statusOptions = ["new", "read", "replied", "archived"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/contact">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Contact Submission Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{submission.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${submission.email}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {submission.email}
                      </a>
                    </div>
                  </div>
                  {submission.phone && (
                    <div className="flex items-start mb-4">
                      <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a
                          href={`tel:${submission.phone}`}
                          className="font-medium"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {submission.company && (
                    <div className="flex items-start mb-4">
                      <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{submission.company}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted Date</p>
                      <p className="font-medium">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                {submission.message}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Submission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusOptions.map((option) => (
                  <Button
                    key={option}
                    variant={status === option ? "default" : "outline"}
                    className={`w-full justify-start ${
                      option === "completed" && status === option
                        ? "bg-green-600 hover:bg-green-700"
                        : option === "archived" && status === option
                        ? "bg-gray-600 hover:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleStatusChange(option)}
                    disabled={isUpdating}
                  >
                    {option.replace("_", " ").charAt(0).toUpperCase() +
                      option.replace("_", " ").slice(1)}
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
                      submission.email
                    )}`;
                    window.open(mailtoUrl, "_blank");
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" /> Reply via Email
                </Button>
                <Button
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="outline"
                  onClick={openDeleteModal}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Submission
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact Submission"
        description="Are you sure you want to delete this contact submission? This action cannot be undone."
        itemDetails={
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {submission.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {submission.email}
            </p>
          </div>
        }
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isDeleting={isDeleting}
      />
    </div>
  );
}