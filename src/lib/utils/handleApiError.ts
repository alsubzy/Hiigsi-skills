// src/lib/utils/handleApiError.ts
import { NextResponse } from 'next/server';
import { ApiError } from './ApiError';

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, errors: error.errors },
      { status: error.statusCode }
    );
  }
  
  console.error('An unexpected error occurred:', error);
  
  return NextResponse.json(
    { message: 'An internal server error occurred.' },
    { status: 500 }
  );
}
