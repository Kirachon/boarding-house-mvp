import { LoginForm } from '@/components/features/auth/login-form'
import { Toaster } from '@/components/ui/sonner'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <LoginForm />
            <Toaster />
        </div>
    )
}
