export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateResumeStepGuidance } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step, targetRole, existingData } = body;

    if (!step || !targetRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const guidance = await generateResumeStepGuidance(step, targetRole, existingData);
    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Error generating resume guidance:', error);
    return NextResponse.json(
      { error: 'Failed to generate guidance' },
      { status: 500 }
    );
  }
}