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

  const fetchSummaries = async () => {
    try {
      if (!userUid) throw new Error('User UID is not set.');
      const response = await fetch('/api/v1/texts/user', {
        method: 'GET',
        headers: {
          'X-User-UID': userUid,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch summaries');
      const data = await response.json();
      console.log(data);
      setSummaries(data);
    } catch (err) {
      console.error('Error fetching summaries:', err);
      // Optionally update the UI to show an error message
    }
  };

  useEffect(() => {
    const saveSummaries = localStorage.getItem('saveSummaries') === 'true';
    const uid = saveSummaries ? localStorage.getItem('userUid') : '';
    setIsSavingEnabled(saveSummaries);
    setUserUid(uid);

    if (saveSummaries && uid) {
      fetchSummaries();
    }
  }, [userUid]); // Add userUid as a dependency to refetch summaries if it changes

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
