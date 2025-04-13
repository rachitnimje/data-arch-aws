// This is a client-safe implementation that doesn't use AWS SDK
// It simply forwards the request to our API route

export async function uploadFileToS3(file: File): Promise<string> {
  // Create a FormData object to send the file
  const formData = new FormData()
  formData.append("file", file)

  try {
    // Send the file to our API route that handles S3 uploads
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to upload file")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}
