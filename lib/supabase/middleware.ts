import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Public Routes Exclusion
    // Allow access to public pages without login
    if (request.nextUrl.pathname.startsWith('/verify')) {
        return response
    }

    if (request.nextUrl.pathname.startsWith('/login')) {
        if (user) {
            // If user is already logged in, redirect to their dashboard
            // For simplicity, we just check role metadata if available or default to something
            // Since we can't easily sync check metadata here without more calls, 
            // we rely on the client or allow them to see login and then redirect.
            // Ideally we redirect, but let's keep it simple.
            return response
        }
        return response as NextResponse
    }

    // Protect all other routes
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login')
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
