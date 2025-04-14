import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si el usuario no está autenticado y está intentando acceder a rutas de administración
  if (!session && req.nextUrl.pathname.startsWith("/admin")) {
    // Excluir la página de login de la redirección
    if (req.nextUrl.pathname === "/admin/login") {
      return res
    }

    // Redirigir a la página de login
    const redirectUrl = new URL("/admin/login", req.url)
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configurar las rutas que deben ser verificadas por el middleware
export const config = {
  matcher: ["/admin/:path*"],
}
