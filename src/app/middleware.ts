import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
    const result = req.nextUrl.pathname.startsWith('/_next')
        || req.nextUrl.pathname.startsWith('/api')
        || PUBLIC_FILE.test(req.nextUrl.pathname);
    if (result) return;

    if (req.nextUrl.locale === 'default') {
        const locale = req.cookies.get('NEXT_LOCALE')?.value ?? req.nextUrl.locale;

        return NextResponse.redirect(
            new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        )
    }
}