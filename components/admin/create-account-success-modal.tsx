"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-gradient rounded-lg p-8 shadow-lg max-w-lg mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Account Created Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          The admin account has been created successfully. You can now use these
          credentials to login to the admin dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={onClose}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function ErrorModal({ isOpen, onClose }: ModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  // Function to handle logout and redirect to login
  const handleLogout = async () => {
    try {
      // Close the modal first
      onClose();

      // logout
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/admin/login");
        router.refresh(); // Refresh to update server components
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // If logout fails, still redirect using full page navigation
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg p-8 shadow-lg max-w-lg mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Not Authorized
        </h1>
        <p className="text-gray-600 mb-8">
          Only the admin user is allowed to create new admin accounts. Please
          log in with the admin account and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center"
          >
            Close
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT hover:from-blue-dark hover:to-purple-dark text-white flex items-center"
          >
            Login as Admin
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
