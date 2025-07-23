export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateResume } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, name, email } = body;

    if (!prompt || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resume = await generateResume({ prompt, name, email });
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}