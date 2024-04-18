import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import PickedFile from './PickedFile';
import uploadIcon from '/upload.svg';
import Spinner from './Spinner.jsx';

// Spinner component using Tailwind CSS for animation

const InputComponent = ({ file }) => {
  const [internalFile, setInternalFile] = useState(null);
  const [text, setText] = useState('');
  const [percentage, setPercentage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      setInternalFile(file);
      setText(''); // Clear text since a file is present
    }
  }, [file]);

  const handleFileChange = (e) => {
    setInternalFile(e.target.files[0]);
    setText('');
    setMessage('');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setInternalFile(null);
    setMessage('');
  };

  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
  };

  const clearFile = () => {
    setInternalFile(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadFileAndSummarize = async () => {
    const headers = { 'X-User-UID': localStorage.getItem('userUid') };
    const formData = new FormData();
    formData.append('file', internalFile);
    formData.append('percentage', Number(percentage));

    setIsLoading(true);
    setMessage('Uploading...');
    try {
      const response = await axios.post(
        'https://www.api.lingosummar.com/api/v1/upload',
        formData,
        {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        },
      );
      setMessage(response.data.message);
      // Navigate to the summary view page after receiving the response
      if (response.data.id) {
        navigate(`/summary/${response.data.id}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const summarizeText = async () => {
    const headers = { 'X-User-UID': localStorage.getItem('userUid') };
    setIsLoading(true);
    setMessage('Summarizing...');
    try {
      const response = await axios.post(
        'https://www.api.lingosummar.com/api/v1/summarize',
        { text, percentage: Number(percentage) },
        { headers },
      );
      setMessage(response.data.message);
      // Navigate to the summary view page after receiving the response
      if (response.data.id) {
        navigate(`/summary/${response.data.id}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start w-full max-w-3xl bg-background-500 rounded-lg shadow-lg p-4 space-y-4 sm:space-y-0">
      <div className="flex-1 w-full sm:mr-4 rounded bg-background-100 flex flex-col p-4">
        {internalFile ? (
          <PickedFile fileName={internalFile.name} onRemove={clearFile} />
        ) : (
          <div className="flex flex-col">
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full bg-background-100 border border-gray-300 rounded-md shadow-inner p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
              style={{ minHeight: '6rem', maxHeight: '12rem' }}
              placeholder="Enter some text to summarize"
              disabled={!!internalFile}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        )}
        <div className="mx-4 mt-2 flex items-center justify-between">
          <label
            htmlFor="percentage"
            className="block font-medium text-text-600"
          >
            Percentage (optional):
          </label>
          <input
            type="text"
            id="percentage"
            value={percentage}
            onChange={handlePercentageChange}
            className="block w-20 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-right p-1"
            pattern="\d*"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
        <button
          onClick={triggerFileInput}
          className="p-2 rounded-full bg-background-200 hover:bg-background-300 transition-all ease-in-out shadow-sm"
        >
          <img src={uploadIcon} alt="File" className="w-8 h-8" />
        </button>
        <button
          onClick={internalFile ? uploadFileAndSummarize : summarizeText}
          disabled={isLoading}
          className="w-23 h-10 bg-primary-500 hover:bg-primary-600 text-text-50 py-2 px-4 rounded-lg transition-colors shadow-md"
        >
          {isLoading ? <Spinner /> : 'Summarize'}
        </button>
      </div>
    </div>
  );
};

export default InputComponent;
