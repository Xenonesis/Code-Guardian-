export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generatePresentation } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, pageCount = 8 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    const slides = await generatePresentation({ prompt, pageCount });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    );
  }
}