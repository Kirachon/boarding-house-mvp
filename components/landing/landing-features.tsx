import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, CreditCard, ShieldCheck, PieChart, Bell } from "lucide-react"

const features = [
    {
        title: "Room Management",
        description: "Track occupancy, manage inventory, and optimize your property capacity with our visual grid.",
        icon: <Home className="h-6 w-6 text-primary" />,
    },
    {
        title: "Tenant Portal",
        description: "Give tenants a dedicated space to view bills, report issues, and manage their stay.",
        icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
        title: "Smart Billing",
        description: "Generate invoices automatically and track payment status. Never miss a rent collection again.",
        icon: <CreditCard className="h-6 w-6 text-primary" />,
    },
    {
        title: "Guest Verification",
        description: "Instantly verify guests with QR codes and ensure your property remains secure.",
        icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
    {
        title: "Financial Analytics",
        description: "Visualize your income, expenses, and profit margins with real-time charts.",
        icon: <PieChart className="h-6 w-6 text-primary" />,
    },
    {
        title: "Maintenance Alerts",
        description: "Receive and track grievance reports from tenants instantly. prioritize fixes efficiently.",
        icon: <Bell className="h-6 w-6 text-primary" />,
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to run your property</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We've built all the essential tools so you can focus on growing your business, not managing spreadsheets.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
