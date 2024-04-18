import React from 'react';

export function SummarizeAgainInput({
  percentage,
  setPercentage,
  summarizeAgain,
  isLoading,
}) {
  return (
    <div className="p-4 bg-background-800 w-2/3 mx-auto fixed inset-x-0 bottom-0 rounded">
      <div className="max-w-md mx-auto flex items-center">
        <input
          type="text"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          placeholder="Enter percentage (Optional)"
          className="flex-1 border rounded p-2 mr-4"
        />
        <button
          onClick={summarizeAgain}
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 text-text-50 font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Summarizing...' : 'Summarize Again'}
        </button>
      </div>
    </div>
  );
}
