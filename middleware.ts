import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const response = NextResponse.next();

    // Get the origin of the request
    const origin = req.headers.get('origin');

    // Check if the origin is allowed
    if (origin && (origin.includes('bsodium.fr') || origin.includes('localhost'))) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    // Handle OPTIONS method for CORS pre-flight
    if (req.method === 'OPTIONS') {
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

        // Respond immediately without passing to Next.js API routes
        return new Response(null, { status: 204, headers: response.headers });
    }
    return response;
}
