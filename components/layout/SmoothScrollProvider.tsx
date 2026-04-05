'use client'

import { useLenis } from '@/hooks/useLenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useLenis()
  return <>{children}</>
}
