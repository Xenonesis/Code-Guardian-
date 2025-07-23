declare module 'pdf-parse' {
  interface PdfData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  function pdf(data: Buffer, options?: any): Promise<PdfData>;
  export = pdf;
}

declare module 'officeparser' {
  function parseOfficeAsync(data: Buffer): Promise<string>;
  export = parseOfficeAsync;
}

declare module 'mammoth' {
  interface ExtractRawTextResult {
    value: string;
    messages: any[];
  }

  function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<ExtractRawTextResult>;
  
  const mammoth: {
    extractRawText: typeof extractRawText;
  };
  export = mammoth;
}