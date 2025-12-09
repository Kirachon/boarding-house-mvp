import { LoginForm } from '@/components/features/auth/login-form'
import { Toaster } from '@/components/ui/sonner'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <LoginForm />
            <Toaster />
        </div>
    )
}
