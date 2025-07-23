import pdf from 'pdf-parse';

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdf(buffer);
  return data.text;
}
