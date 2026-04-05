'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Compass, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('')

  function handleSearch() {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (date) params.set('date', date)
    if (type) params.set('type', type)
    router.push(`/experiences?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border-2 border-black/10 shadow-2xl p-2',
        'flex flex-col md:flex-row md:items-center',
        'w-full max-w-2xl',
        className
      )}
    >
      {/* Field 1 — Location */}
      <div className="flex items-center gap-2 px-4 py-3 md:py-2 flex-1 min-w-0 border-b border-gray-100 md:border-none hover:bg-gray-50 rounded-lg transition-colors">
        <MapPin size={16} className="text-blue flex-none" />
        <div className="flex flex-col min-w-0 w-full">
          <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
            where to?
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-gray-700 text-sm font-body focus:outline-none cursor-pointer w-full"
          >
            <option value="">All Destinations</option>
            <option value="himachal-pradesh">Himachal Pradesh</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="kashmir">Kashmir</option>
            <option value="uttarakhand">Uttarakhand</option>
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-10 bg-gray-200 self-center mx-1 flex-none" />

      {/* Field 2 — Date */}
      <div className="flex items-center gap-2 px-4 py-3 md:py-2 flex-1 min-w-0 border-b border-gray-100 md:border-none hover:bg-gray-50 rounded-lg transition-colors">
        <Calendar size={16} className="text-blue flex-none" />
        <div className="flex flex-col min-w-0 w-full">
          <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
            when?
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-gray-700 text-sm font-body focus:outline-none cursor-pointer w-full"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-10 bg-gray-200 self-center mx-1 flex-none" />

      {/* Field 3 — Experience type */}
      <div className="flex items-center gap-2 px-4 py-3 md:py-2 flex-1 min-w-0 border-b border-gray-100 md:border-none hover:bg-gray-50 rounded-lg transition-colors">
        <Compass size={16} className="text-blue flex-none" />
        <div className="flex flex-col min-w-0 w-full">
          <label className="font-handwriting text-xs text-gray-400 leading-none mb-0.5">
            what?
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent text-gray-700 text-sm font-body focus:outline-none cursor-pointer w-full"
          >
            <option value="">All Experiences</option>
            <option value="group-trips">Group Trips</option>
            <option value="day-trips">Day Trips</option>
            <option value="stays">Stays</option>
            <option value="activities">Activities</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="mt-2 md:mt-0 md:ml-2 bg-yellow text-dark font-heading font-bold rounded-lg px-6 py-3 border-2 border-dark flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 flex-none w-full md:w-auto"
        aria-label="Search experiences"
      >
        <Search size={16} />
        Search
      </button>
    </div>
  )
}
