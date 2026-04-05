'use client'

import { useState } from 'react'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { INDIA_STATES } from './india-map-paths'

interface IndiaMapProps {
  activeRegion: string
  onRegionClick: (slug: string) => void
}

export function IndiaMap({ activeRegion, onRegionClick }: IndiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const isAllMode = activeRegion === 'all'

  const hoveredTheme = hoveredRegion
    ? REGION_THEMES[hoveredRegion as RegionThemeKey]
    : null

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Hover region label */}
      <div className="h-8 flex items-center justify-center mb-1">
        {hoveredTheme ? (
          <span
            style={{ backgroundColor: hoveredTheme.primary }}
            className="text-white font-body text-xs px-4 py-1.5 rounded-full shadow-md"
          >
            {hoveredTheme.emoji} {hoveredTheme.name}
          </span>
        ) : (
          <span className="font-handwriting text-dark/30 text-sm">
            hover a colored region
          </span>
        )}
      </div>

      <svg
        viewBox="0 0 500 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {INDIA_STATES.map((state) => {
          const isRegionState = state.region !== ''
          const theme = isRegionState
            ? REGION_THEMES[state.region as RegionThemeKey]
            : null
          const isActive = state.region === activeRegion
          const isHovered = state.region === hoveredRegion

          let fill: string
          let opacity = 1

          if (theme) {
            fill = theme.primary
            if (isActive || isHovered) {
              opacity = 1
            } else if (isAllMode) {
              opacity = 0.75
            } else {
              opacity = 0.3
            }
          } else {
            fill = '#C8BDAE'
            opacity = 1
          }

          return (
            <path
              key={state.name}
              d={state.d}
              fill={fill}
              fillOpacity={opacity}
              stroke="#FFFFFF"
              strokeWidth={0.8}
              style={{
                cursor: isRegionState ? 'pointer' : 'default',
                transition: 'fill-opacity 0.2s ease',
              }}
              onClick={
                isRegionState
                  ? () => onRegionClick(state.region)
                  : undefined
              }
              onMouseEnter={() => {
                if (isRegionState) setHoveredRegion(state.region)
              }}
              onMouseLeave={() => setHoveredRegion(null)}
            />
          )
        })}
      </svg>

      <p className="text-center font-handwriting text-dark/40 text-sm mt-2">
        click a region to filter ↑
      </p>
    </div>
  )
}
