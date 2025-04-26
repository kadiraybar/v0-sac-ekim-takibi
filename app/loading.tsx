import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[300px] col-span-full lg:col-span-2" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  )
}
