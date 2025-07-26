import React from 'react';
import ErrorTestCard from '../components/test/ErrorTestCard';

const ErrorTestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Error Handling Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the improved error messages for AI API failures
        </p>
      </div>
      
      <ErrorTestCard />
    </div>
  );
};

export default ErrorTestPage;
