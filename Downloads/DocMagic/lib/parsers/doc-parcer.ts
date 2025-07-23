import officeParser from 'officeparser';

export async function extractTextFromDoc(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    return (officeParser as any).parseOfficeAsync(buffer);
  } catch (error) {
    console.error('DOC parsing error:', error);
    throw new Error(`Failed to parse DOC: ${error instanceof Error ? error.message : String(error)}`);
  }
}
