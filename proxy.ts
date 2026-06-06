import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Toda la aplicación es pública. No se requiere autenticación.
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
