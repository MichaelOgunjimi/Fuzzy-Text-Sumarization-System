import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import SummaryForm from './components/SummaryForm.jsx';
import SummaryView from './components/SummaryView.jsx';

import './index.css';

const App = () => {
  const [isSavingEnabled, setIsSavingEnabled] = useState(false);
  const [userUid, setUserUid] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      if (!userUid) throw new Error('User UID is not set.');
      const response = await fetch(
        'https://www.api.lingosummar.com/api/v1/texts/user',
        {
          method: 'GET',
          headers: {
            'X-User-UID': userUid,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch summaries');
      const data = await response.json();
      setSummaries(data);
    } catch (err) {
      console.error('Error fetching summaries:', err);
      // Optionally update the UI to show an error message
    } finally {
      setIsLoading(false); // Ensure isLoading is always set to false
    }
  };

  useEffect(() => {
    const saveSummaries = localStorage.getItem('saveSummaries') === 'true';
    const uid = saveSummaries ? localStorage.getItem('userUid') : '';
    setIsSavingEnabled(saveSummaries);
    setUserUid(uid);
  }, []);

  useEffect(() => {
    if (userUid) {
      fetchSummaries();
    }
  }, [userUid]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <SummaryForm
              summaries={summaries}
              isSavingEnabled={isSavingEnabled}
              isLoading={isLoading}
            />
          }
        />
        <Route
          path="/summary/:id"
          element={<SummaryView summaries={summaries} />}
        />
      </Routes>
    </div>
  );
};

export default App;
