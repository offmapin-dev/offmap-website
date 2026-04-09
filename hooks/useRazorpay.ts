'use client'

import { useState, useCallback } from 'react'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

export interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open: () => void
  close: () => void
}

export function useRazorpay() {
  const [loaded, setLoaded] = useState(false)

  const loadScript = useCallback((): Promise<boolean> => {
    if (typeof window === 'undefined') return Promise.resolve(false)
    if (document.getElementById('razorpay-checkout-js')) {
      setLoaded(true)
      return Promise.resolve(true)
    }
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.id = 'razorpay-checkout-js'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setLoaded(true)
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  return { loaded, loadScript }
}
