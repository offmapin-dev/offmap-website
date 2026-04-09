import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <p className="font-display font-black text-[8rem] leading-none text-dark/5">
          404
        </p>
        <h1 className="font-display font-bold text-dark text-2xl md:text-3xl -mt-8">
          You&apos;ve gone truly off the map.
        </h1>
        <p className="font-handwriting text-gray-400 text-lg mt-3">
          even we haven&apos;t been here
        </p>
        <p className="font-body text-gray-500 text-sm mt-6">
          This page doesn&apos;t exist — maybe it&apos;s still being explored.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 font-display italic font-bold text-lg bg-yellow text-dark px-8 py-4 rounded-none border-2 border-dark hover:bg-yellow/80 transition-colors"
        >
          Back to Base Camp →
        </Link>
      </div>
    </main>
  )
}
