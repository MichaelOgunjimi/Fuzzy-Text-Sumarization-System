import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeftArrowIcon, RightArrowIcon } from './utilities/Svgs.jsx';
import { SummarizeAgainInput } from './utilities/SummarizeAgainInput.jsx';
import Sidebar from './Sidebar.jsx'; // Assuming Sidebar is a default export
import Summary from './Summary.jsx';
import TypingSummary from './TypingSummary.jsx';
import Spinner from './utilities/Spinner.jsx';

const SummaryView = ({ summaries }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchSummary(id);
  }, [id]);

  const handleSummarizeAgain = (newSummary) => {
    newSummary.timestamp = new Date(); // Add a timestamp when the summary is added
    setCurrentSummary((prevSummary) => ({
      ...prevSummary,
      summaries: [...prevSummary.summaries, newSummary],
    }));
    setLastUpdated(new Date());
  };

  async function fetchSummary(id) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.api.lingosummar.com/api/v1/text/summary/${id}`,
      );
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setCurrentSummary(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setIsLoading(false);
    }
  }

  async function summarizeAgain() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.api.lingosummar.com/api/v1/summarize-again/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ percentage: Number(percentage) }),
        },
      );
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      handleSummarizeAgain(data.summary);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTypingComplete = () => {
    setTypingComplete((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen bg-background-50">
      {sidebarOpen && <Sidebar summaries={summaries} id={id} />}
      <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MainContent
        sidebarOpen={sidebarOpen}
        currentSummary={currentSummary}
        percentage={percentage}
        setPercentage={setPercentage}
        summarizeAgain={summarizeAgain}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        handleTypingComplete={handleTypingComplete}
      />
    </div>
  );
};

const ToggleButton = ({ sidebarOpen, setSidebarOpen }) => (
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
);

const MainContent = ({
  sidebarOpen,
  currentSummary,
  percentage,
  setPercentage,
  summarizeAgain,
  isLoading,
  lastUpdated,
  typingComplete,
}) => {
  const summaryContentRef = useRef(null);

  useEffect(() => {
    if (summaryContentRef.current) {
      summaryContentRef.current.scrollTop =
        summaryContentRef.current.scrollHeight;
    }
  }, [currentSummary, isLoading, typingComplete]);

  return (
    <div
      className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-0'} mb-16 transition-margin duration-300`}
    >
      <div className="p-4 mx-20 flex flex-col h-full">
        <div
          className="flex-1 overflow-auto scrollbar h-full bg-background-100 p-5"
          ref={summaryContentRef}
        >
          {isLoading ? (
            <Spinner size={3} />
          ) : (
            currentSummary && (
              <>
                <Summary
                  summary={{
                    text: currentSummary.text,
                    created_at: currentSummary.created_at,
                    uploaded_filename: currentSummary.uploaded_filename,
                  }}
                  isOriginal={true}
                />
                {currentSummary.summaries &&
                  currentSummary.summaries.map((summary, index) => {
                    const isLatestOrOnly =
                      (lastUpdated &&
                        summary.timestamp &&
                        new Date(summary.timestamp).getTime() ===
                          lastUpdated.getTime()) ||
                      currentSummary.summaries.length === 1;

                    return isLatestOrOnly ? (
                      <TypingSummary
                        key={summary.id}
                        summary={summary}
                        onTypingComplete={typingComplete}
                      />
                    ) : (
                      <Summary
                        key={summary.id}
                        summary={summary}
                        isOriginal={false}
                      />
                    );
                  })}
              </>
            )
          )}
          {isLoading && (
            <div className="flex items-center justify-start gap-4 align-center">
              <Spinner size={3} />
              <p className="text-text-600">Summarizing...</p>
            </div>
          )}
        </div>
        <SummarizeAgainInput
          percentage={percentage}
          setPercentage={setPercentage}
          summarizeAgain={summarizeAgain}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SummaryView;
