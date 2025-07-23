export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { generateGuidedResume } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      links,
      targetRole,
      jobDescription
    } = body;

    if (!personalInfo || !targetRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resume = await generateGuidedResume({
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      links,
      targetRole,
      jobDescription
    });
    
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error generating guided resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}