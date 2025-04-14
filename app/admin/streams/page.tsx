import StreamsManagement from "@/components/admin/streams-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AuthCheck from "@/components/admin/auth-check"

export default function AdminStreamsPage() {
  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="flex items-center text-jade-400 mb-2 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel de administración
            </Link>
            <h1 className="text-2xl font-bold text-jade-400">Gestión de Transmisiones</h1>
          </div>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-jade-400">Transmisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <StreamsManagement />
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
}
