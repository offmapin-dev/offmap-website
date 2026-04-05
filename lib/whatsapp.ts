/** Build wa.me URL with optional pre-filled message (UTF-8 encoded). */
export function buildWhatsAppUrl(prefillText: string, phoneE164 = '919211471385'): string {
  const base = `https://wa.me/${phoneE164}`
  if (!prefillText.trim()) return base
  return `${base}?text=${encodeURIComponent(prefillText)}`
}
