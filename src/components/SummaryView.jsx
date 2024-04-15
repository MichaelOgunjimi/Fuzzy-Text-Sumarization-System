import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LeftArrowIcon, RightArrowIcon } from './utilities/Svgs.jsx';
import PickedFile from './PickedFile.jsx'; // Ensure these icons are imported correctly

const SummaryView = ({ summaries }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSummary, setCurrentSummary] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(''); // State to hold the percentage input

  function handleSummaryChange(summmary) {}
  async function fetchSummary(id) {
    try {
      const response = await fetch(`/api/v1/text/summary/${id}`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setCurrentSummary(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      // Optionally update the UI to show an error message
    }
  }

  useEffect(() => {
    if (id) {
      fetchSummary(id);
    }
  }, [id]);

  const onStartAddSummary = () => {
    navigate('/');
  };

  async function SummarizeAgain() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/summarize-again/${id}`,
        { percentage: Number(percentage) },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      handleSummaryChange();
      console.log(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      // Optionally update the UI to show an error message
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen  bg-background-50 ">
      {sidebarOpen && (
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
      )}

      {/* Toggle Button */}
      <div
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${sidebarOpen ? 'translate-x-64' : 'translate-x-0'}`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-700 hover:bg-blue-800 p-2 rounded-full text-white focus:outline-none"
        >
          {sidebarOpen ? <LeftArrowIcon /> : <RightArrowIcon />}
        </button>
      </div>

      <div
        className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-0'} transition-margin duration-300`}
      >
        <div className="p-4 mx-20 flex flex-col h-full">
          <div className="flex-1 overflow-auto scrollbar h-full bg-background-100 p-5">
            {/*summary text component to be added here and align to right */}
            <div className="p-4 bg-background-200 rounded mb-4 w-2/3 ml-auto">
              {currentSummary.uploaded_filename ? (
                <>
                  <h3 className="text-2xl font-bold text-text-700">
                    Your File
                  </h3>
                  <PickedFile fileName={currentSummary.uploaded_filename} />
                </>
              ) : (
                <div className="p-4 bg-background-200 rounded mb-4">
                  <h3 className="text-2xl font-bold text-text-700">
                    Your Text
                  </h3>
                  <p className="text-text-700">{currentSummary.text}</p>
                </div>
              )}
            </div>

            {/*summary text component to be added here and align to left */}
            <div className="p-4 bg-background-200 rounded mb-4 w-2/3 mr-auto">
              {currentSummary.summaries &&
                currentSummary.summaries.map((summary) => (
                  <div key={summary.id}>
                    <p className="text-text-700">{summary.text}</p>
                  </div>
                ))}
            </div>
          </div>
          {/* Fixed Input and Button Area, centered horizontally within the main view */}
          <div className="p-4 bg-background-800 w-2/3 mx-auto fixed inset-x-0 bottom-0 rounded">
            <div className="max-w-md mx-auto flex items-center">
              <input
                type="text"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Enter percentage(Optional)"
                className="flex-1 border rounded p-2 mr-4"
              />
              <button
                onClick={SummarizeAgain}
                className="bg-primary-500 hover:bg-primary-600 text-text-50 font-bold py-2 px-4 rounded"
              >
                Summarize Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
