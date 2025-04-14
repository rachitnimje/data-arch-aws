"use client"

import { useState } from "react"
import { Trash2, AlertCircle } from "lucide-react"

interface DeleteJobButtonProps {
  jobId: number
  jobTitle: string
  onSuccess: () => void
}

export default function DeleteJobButton({ jobId, jobTitle, onSuccess }: DeleteJobButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasApplications, setHasApplications] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)
  const [forceDelete, setForceDelete] = useState(false)

  const handleDeleteClick = () => {
    setError(null)
    setShowConfirmDialog(true)
  }

  const closeDialog = () => {
    setShowConfirmDialog(false)
    setForceDelete(false)
    setError(null)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // If we know there are applications and force delete is selected
      if (hasApplications && forceDelete) {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ forceDelete: true }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to delete job")
        }
        
        onSuccess()
        closeDialog()
        return
      }

      // Regular delete attempt
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        // If the error is because of existing applications
        if (response.status === 409 && data.hasApplications) {
          setHasApplications(true)
          if (data.applicationCount) {
            setApplicationCount(data.applicationCount)
          }
          setError(data.message || "This job has applications and cannot be deleted")
        } else {
          throw new Error(data.message || "Failed to delete job")
        }
      } else {
        onSuccess()
        closeDialog()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="bg-white text-red-600 p-2 rounded hover:bg-red-200 transition-colors"
        title="Delete job"
      >
        <Trash2 size={16} />
      </button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Delete Job Posting
            </h3>
            
            <p className="mb-4">
              Are you sure you want to delete <strong>{jobTitle}</strong>?
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{error}</p>
                  
                  {hasApplications && (
                    <div className="mt-3">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id="forceDelete"
                          checked={forceDelete}
                          onChange={(e) => setForceDelete(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="forceDelete" className="text-sm font-medium text-red-800">
                          Delete this job and all {applicationCount} associated application{applicationCount !== 1 ? 's' : ''}
                        </label>
                      </div>
                      <p className="text-xs text-red-500">
                        Warning: This action cannot be undone. All candidate data for this job will be permanently deleted.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting || (hasApplications && !forceDelete)}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}