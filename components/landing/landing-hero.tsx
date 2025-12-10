import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LandingHero() {
    return (
        <section className="relative py-20 lg:py-32 flex flex-col items-center text-center px-4 overflow-hidden">
            {/* Animated Background Spheres */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -z-10" />

            <div className="container mx-auto relative z-10">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors border-primary/20 bg-primary/5 text-primary mb-6 backdrop-blur-sm">
                    ✨ Now with Automated Payments
                </div>
                <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
                    Manage your property like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">Pro</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    The all-in-one platform for boarding house owners. Track rent, manage rooms, and verify tenants in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 border-0">
                            Start Managing Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50">
                            See Features
                        </Button>
                    </Link>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-16 rounded-xl border border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden max-w-5xl mx-auto aspect-video flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

                    {/* Mock UI Content */}
                    <div className="grid grid-cols-4 gap-4 p-8 w-full h-full opacity-50 blur-[1px] group-hover:blur-none group-hover:opacity-100 transition-all duration-700">
                        <div className="col-span-1 bg-muted/50 rounded-lg h-full animate-pulse delay-100" />
                        <div className="col-span-3 grid grid-rows-3 gap-4">
                            <div className="bg-muted/50 rounded-lg h-full animate-pulse delay-200" />
                            <div className="grid grid-cols-3 gap-4 row-span-2">
                                <div className="bg-muted/50 rounded-lg h-full animate-pulse delay-300" />
                                <div className="bg-muted/50 rounded-lg h-full animate-pulse delay-500" />
                                <div className="bg-muted/50 rounded-lg h-full animate-pulse delay-700" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-md px-6 py-3 rounded-full border shadow-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl">
                                📊
                            </div>
                            <span className="font-semibold text-foreground">Interactive Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
