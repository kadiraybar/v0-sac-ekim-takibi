import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground">Aradığınız sayfa bulunamadı.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  )
}
