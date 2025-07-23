interface LetterPreviewProps {
  letter: any;
}

export function LetterPreview({ letter }: LetterPreviewProps) {
  if (!letter) return null;

  // Ensure letter has the expected structure to prevent "Cannot read properties of undefined" errors
  const from = letter.from || {};
  const to = letter.to || {};
  const date = letter.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const subject = letter.subject || "";
  const content = letter.content || "";

  return (
    <div className="p-8 max-w-[800px] mx-auto font-serif bg-white text-black">
      {/* Sender Information */}
      <div className="mb-8">
        {from.name && (
          <p className="mb-1 font-semibold">{from.name}</p>
        )}
        {from.address && (
          <p className="text-sm text-gray-700 whitespace-pre-line">{from.address}</p>
        )}
      </div>
      
      {/* Date */}
      <div className="mb-8">
        <p className="mb-1">{date}</p>
      </div>
      
      {/* Recipient Information */}
      <div className="mb-8">
        {to.name && (
          <p className="mb-1 font-semibold">{to.name}</p>
        )}
        {to.address && (
          <p className="text-sm text-gray-700 whitespace-pre-line">{to.address}</p>
        )}
      </div>
      
      {/* Subject Line */}
      {subject && (
        <div className="mb-6">
          <p className="font-semibold">Subject: {subject}</p>
        </div>
      )}
      
      {/* Letter Content */}
      <div className="whitespace-pre-line text-gray-800 leading-relaxed">
        {content}
      </div>
    </div>
  );
}