export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generatePresentation } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outlines, template = 'modern', prompt } = body;

    if (!outlines || !Array.isArray(outlines)) {
      return NextResponse.json(
        { error: 'Missing or invalid outlines' },
        { status: 400 }
      );
    }

    const slides = await generatePresentation({ outlines, template, prompt });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error generating full presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate full presentation' },
      { status: 500 }
    );
  }
}