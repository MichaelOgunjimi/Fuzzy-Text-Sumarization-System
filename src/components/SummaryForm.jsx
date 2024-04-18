import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useDropzone } from 'react-dropzone';
import InputComponent from './utilities/InputComponent.jsx'; // Importing the existing InputComponent

const groupSummariesByDate = (summaries) => {
  const today = new Date();
  const sevenDaysAgo = new Date().setDate(today.getDate() - 7);

  const groups = {
    today: [],
    lastSevenDays: [],
    older: [],
  };

  summaries.forEach((summary) => {
    const createdAt = new Date(summary.created_at);
    if (createdAt.toDateString() === today.toDateString()) {
      groups.today.push(summary);
    } else if (createdAt > sevenDaysAgo) {
      groups.lastSevenDays.push(summary);
    } else {
      groups.older.push(summary);
    }
  });

  return groups;
};

const SummaryForm = ({ summaries, isSavingEnabled }) => {
  const [file, setFile] = useState(null); // State to hold the dropped file

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]); // Set the first accepted file
      console.log('File dropped:', acceptedFiles[0]); // You can handle the file here
    },
    noClick: true, // Disables the default click to open file dialog behavior
    noKeyboard: true, // Optional: Disables keyboard interaction
  });

  const groupedSummaries = groupSummariesByDate(summaries);

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center min-h-screen bg-background-50 p-4 ${isDragActive ? 'bg-primary-100' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <p className="text-lg text-primary-700 font-bold">
          Drop the files here ...
        </p>
      )}
      <h1 className="text-3xl font-bold text-primary-700 mb-2">
        Welcome to LingoSummer!
      </h1>
      <p className="text-lg text-text-500 mb-2">
        Quickly summarize your documents or text right here.
      </p>
      <p className="text-md text-text-400 mb-4">
        Enter the text you'd like to summarize below, or upload a document to
        get started.
      </p>
      <p className="text-md text-text-400 mb-6 italic">
        You can also drag and drop your file here. Supported formats include
        TXT, PDF, DOC, and DOCX.
      </p>
      <InputComponent file={file} />

      <div className="w-full flex justify-center my-4">
        <hr className="border-background-300 w-1/2" />
      </div>
      <h2 className="text-xl text-primary-600 font-semibold mb-2">
        Your Previous Summaries
      </h2>
      {isSavingEnabled ? (
        Object.entries(groupedSummaries).map(
          ([key, group]) =>
            group.length > 0 && (
              <div
                key={key}
                className="mt-6 w-full max-w-md mx-auto max-h-64 overflow-y-auto scrollbar"
              >
                <h3 className="text-lg text-text-500 font-semibold mb-1">
                  {key === 'today'
                    ? 'Today'
                    : key === 'lastSevenDays'
                      ? 'Last 7 Days'
                      : 'Older'}
                </h3>
                <ul className="list-none pl-5 text-text-500">
                  {group.map((summary) => (
                    <li
                      key={summary.id}
                      className="mb-1 p-2 hover:bg-background-200 rounded-md transition-all duration-200 ease-in-out"
                    >
                      <Link
                        to={`/summary/${summary.id}`}
                        className="hover:text-primary-700 hover:underline"
                      >
                        {summary.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )
      ) : (
        <p className="text-lg text-primary-600 mt-6 font-semibold">
          Previous history is disabled. You can use the toggle above to enable
          saving.
        </p>
      )}
    </div>
  );
};

export default SummaryForm;
