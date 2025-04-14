export function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-dark"></div>
    </div>
  );
}

export function EditLoadingAnimation() {
  return (
    <div className="container mx-auto max-w-13xl">
      <div className="flex items-center mb-6">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mr-4"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
