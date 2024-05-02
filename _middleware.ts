import type { NextFetchEvent, NextRequest } from 'next/server';
import { middleware as customCorsMiddleware } from './middleware';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    return customCorsMiddleware(req);
}
