import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ summaries, id }) {
  const navigate = useNavigate();
  const onStartAddSummary = () => {
    navigate('/');
  };
  return (
    <aside className="fixed top-0 left-0 h-full w-1/3 bg-background-800 text-text-50 md:w-72 rounded-r-xl transition-all duration-300 ease-in-out">
      <div className="px-8 py-16 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h2 className="font-bold uppercase text-xl text-text-200">
            Your Summaries
          </h2>
        </div>
        <button
          onClick={onStartAddSummary}
          className="mt-8 w-full bg-primary-500 hover:bg-primary-600 text-text-50 font-bold py-2 px-4 rounded"
        >
          + Add Summary
        </button>
        <h2 className="font-bold  text-l text-text-200 mt-8">
          Your Previous Summaries
        </h2>
        <ul className="overflow-auto mt-2 scrollbar">
          {summaries.map((summary) => (
            <Link to={`/summary/${summary.id}`} key={summary.id}>
              <li
                className={`py-1 px-2 my-1 rounded-sm ${summary.id === id ? 'bg-primary-700 text-text-50' : 'text-text-300 hover:text-text-50 hover:bg-background-700'}`}
              >
                {summary.title.substring(0, 25) +
                  (summary.title.length > 25 ? '...' : '')}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  );
}
