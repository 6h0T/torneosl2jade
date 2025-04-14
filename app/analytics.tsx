"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views when the pathname or search params change
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    // You can add custom page view tracking here if needed
  }, [pathname, searchParams])

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  )
}
