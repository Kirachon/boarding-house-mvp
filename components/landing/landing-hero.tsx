import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LandingHero() {
    return (
        <section className="py-20 lg:py-32 flex flex-col items-center text-center px-4 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
                    ✨ Now with Automated Payments
                </div>
                <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
                    Manage your property like a <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Pro</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    The all-in-one platform for boarding house owners. Track rent, manage rooms, and verify tenants in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                            Start Managing Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                            See Features
                        </Button>
                    </Link>
                </div>

                {/* Placeholder for Dashboard Preview Image */}
                <div className="mt-16 rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden max-w-5xl mx-auto aspect-video flex items-center justify-center bg-muted/20 relative group cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    <div className="text-muted-foreground z-20 font-medium flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            📊
                        </div>
                        <span>Dashboard Preview</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
