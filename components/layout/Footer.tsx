import Link from 'next/link'
import { Instagram, Youtube, Linkedin } from 'lucide-react'
import { FOOTER_LINKS, SITE_CONFIG } from '@/lib/constants'
import { TornEdge } from '@/components/ui/scrapbook'

export default function Footer() {
  return (
    <footer className="relative">
      {/* Torn paper transition into kraft bg */}
      <TornEdge position="top" color="#5C3D11" />

      <div className="kraft-bg text-white">
        {/* Brand header */}
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center">
          <h2 className="font-display italic font-bold text-4xl md:text-5xl text-white mb-2">
            OffMap India
          </h2>
          <p className="font-handwriting text-yellow text-xl">
            handcrafted for the analog explorer
          </p>

          {/* Yellow divider */}
          <div className="w-24 h-0.5 bg-yellow mx-auto mt-6 mb-10" />
        </div>

        {/* Main grid */}
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {FOOTER_LINKS.map((column) => (
              <div key={column.heading}>
                <h3 className="font-handwriting text-yellow text-lg mb-4">
                  {column.heading}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-sm text-white/70 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact strip */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-t border-white/10 text-sm text-white/60">
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <span>📞</span>
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <span>📩</span>
              {SITE_CONFIG.email}
            </a>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-white/10">
            {/* Copyright */}
            <p className="font-body text-sm text-white/50">
              © {new Date().getFullYear()} {SITE_CONFIG.name}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SITE_CONFIG.socials.instagram !== undefined && (
                <a
                  href={SITE_CONFIG.socials.instagram || '#'}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow text-dark hover:scale-110 transition-transform duration-200"
                >
                  <Instagram size={15} />
                </a>
              )}
              {SITE_CONFIG.socials.youtube !== undefined && (
                <a
                  href={SITE_CONFIG.socials.youtube || '#'}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow text-dark hover:scale-110 transition-transform duration-200"
                >
                  <Youtube size={15} />
                </a>
              )}
              {SITE_CONFIG.socials.linkedin !== undefined && (
                <a
                  href={SITE_CONFIG.socials.linkedin || '#'}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow text-dark hover:scale-110 transition-transform duration-200"
                >
                  <Linkedin size={15} />
                </a>
              )}
            </div>

            {/* Tagline */}
            <p className="font-handwriting italic text-white/40 text-base">
              no itineraries, just stories
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
