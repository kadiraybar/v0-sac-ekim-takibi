"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Bir şeyler yanlış gitti</h2>
        <p className="text-muted-foreground">Sayfayı yüklerken bir hata oluştu.</p>
        <Button onClick={() => reset()}>Tekrar Dene</Button>
      </div>
    </div>
  )
}
