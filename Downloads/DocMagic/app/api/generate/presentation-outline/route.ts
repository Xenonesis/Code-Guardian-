export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generatePresentationOutline } from '@/lib/gemini';

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

    const outlines = await generatePresentationOutline({ prompt, pageCount });
    return NextResponse.json({ outlines });
  } catch (error) {
    console.error('Error generating presentation outline:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation outline' },
      { status: 500 }
    );
  }
}