import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
    return (
        <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                <div className="font-bold text-xl text-primary flex items-center gap-2">
                    <span className="text-2xl">🏠</span> BoardingHouse
                </div>
                <div className="flex gap-4">
                    <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
                    <Link href="/login"><Button>Get Started</Button></Link>
                </div>
            </div>
        </nav>
    )
}
