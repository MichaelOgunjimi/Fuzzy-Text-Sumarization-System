import React, { useState } from 'react';
import { CopyIcon, InfoIcon, SpeakerIcon } from './utilities/Svgs.jsx';
import PickedFile from './utilities/PickedFile.jsx';

export default function Summary({ summary, isOriginal }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary.text);
  };

  const toggleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (!isSpeaking) {
        const utterance = new SpeechSynthesisUtterance(summary.text);
        utterance.voice = speechSynthesis
          .getVoices()
          .find((voice) => voice.lang === 'en-US'); // Optionally set the voice
        utterance.onend = () => setIsSpeaking(false); // Update state when speaking ends
        utterance.onerror = () => setIsSpeaking(false); // Update state on error
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      } else {
        speechSynthesis.cancel(); // Stop speaking
        setIsSpeaking(false);
      }
    } else {
      alert('Sorry, your browser does not support text-to-speech!');
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`p-4 rounded mb-4 relative flex flex-col gap-4 ${isOriginal ? 'bg-background-300' : 'bg-background-200'}`}
    >
      <div className="flex items-center gap-2 justify-end">
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="text-text-600 hover:text-accent-500"
          >
            <CopyIcon />
          </button>
          <button
            onClick={toggleSpeak}
            className="text-text-600 hover:text-accent-500"
          >
            <SpeakerIcon />
          </button>
        </div>
        {!isOriginal ? (
          <button
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
            className="text-text-600 hover:text-accent-500"
          >
            <InfoIcon />
          </button>
        ) : null}
      </div>

      {isOriginal ? (
        <h3 className="text-xl font-bold text-text-700">Original Text</h3>
      ) : (
        <h3 className="text-xl font-bold text-text-700">Summarized Text</h3>
      )}

      {isOriginal && summary.uploaded_filename ? (
        <PickedFile fileName={summary.uploaded_filename} />
      ) : (
        <p className={`text-text-500 mb-4 ${isOriginal ? 'font-bold' : ''}`}>
          {summary.text}
        </p>
      )}

      {showDetails && (
        <div className="absolute top-12 right-5 p-2 bg-background-800 text-text-50 rounded-lg">
          <p>Words: {summary.words}</p>
          <p>Percentage: {summary.percentage}%</p>
        </div>
      )}
      <div className="text-text-600">
        <p>{formatDate(summary.created_at)}</p>
      </div>
    </div>
  );
}
