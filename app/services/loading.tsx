import { Skeleton } from "@/components/ui/skeleton"

export default function ServicesLoading() {
  return (
    <main className="pt-24 pb-16">
      {/* Hero Section Loading */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-full mx-auto mb-2" />
          <Skeleton className="h-6 w-5/6 mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Grid Loading */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <Skeleton className="h-10 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow">
                <Skeleton className="h-12 w-12 mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
        </div>
      </section>

      {/* Approach Section Loading */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="text-center">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section Loading */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl p-8 md:p-12 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-5/6 mx-auto mb-8" />
          <Skeleton className="h-12 w-40 rounded-full mx-auto" />
        </div>
      </section>
    </main>
  )
}
