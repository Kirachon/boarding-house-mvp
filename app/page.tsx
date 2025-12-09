import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingHero } from '@/components/landing/landing-hero'
import { LandingFeatures } from '@/components/landing/landing-features'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        © 2024 Boarding House Management. All rights reserved.
      </footer>
    </div>
  );
}
