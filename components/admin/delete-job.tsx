"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  errorMessage?: string;
}

export function DeleteJobModal({
  isOpen,
  onClose,
  onConfirm,
  errorMessage,
}: DeleteJobModalProps) {
  const hasError = Boolean(errorMessage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${hasError ? "text-red-600" : ""}`}>
            {hasError ? (
              <>
                <AlertCircle className="h-5 w-5" />
                Cannot Delete Job
              </>
            ) : (
              "Confirm Deletion"
            )}
          </DialogTitle>
          <DialogDescription className="pt-4">
            {hasError 
              ? errorMessage 
              : "Are you sure you want to delete this job post? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          {hasError ? (
            <Button onClick={onClose}>Understood</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}