import { NextResponse } from 'next/server';

// Toda la aplicación es pública. No se requiere autenticación.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
