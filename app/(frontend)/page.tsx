import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { DestinationsSection } from '@/components/sections/DestinationsSection'
import { QuickNavSection } from '@/components/sections/QuickNavSection'
import { FeaturedExperiencesSection } from '@/components/sections/FeaturedExperiencesSection'
import { StaysTeaserSection } from '@/components/sections/StaysTeaserSection'
import { StudentProgramSection } from '@/components/sections/StudentProgramSection'
import { BlogsTeaserSection } from '@/components/sections/BlogsTeaserSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FinalCtaSection } from '@/components/sections/FinalCtaSection'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MarqueeStrip />
      <AboutSection />
      <DestinationsSection />
      <QuickNavSection />
      <FeaturedExperiencesSection />
      <StaysTeaserSection />
      <StudentProgramSection />
      <TestimonialsSection />
      <BlogsTeaserSection />
      <FinalCtaSection />
    </main>
  )
}
