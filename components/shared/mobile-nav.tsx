'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, AlertCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
    const pathname = usePathname()

    const items = [
        { href: '/tenant/dashboard', label: 'Home', icon: Home },
        { href: '/tenant/issues', label: 'Issues', icon: AlertCircle },
        { href: '/tenant/payments', label: 'Pay', icon: FileText },
        { href: '/tenant/profile', label: 'Profile', icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="grid grid-cols-4 h-16">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                        >
                            <div
                                className={cn(
                                    "p-1.5 rounded-xl transition-colors",
                                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
