import React, { useState } from 'react';
import './App.css';

// Replace with your Pexels API key
const API_KEY = 'YOUR_PEXELS_API_KEY';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch video based on input text from Pexels API
  const fetchVideo = async (text) => {
    const endpoint = `https://api.pexels.com/videos/search?query=${text}&per_page=1`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data = await response.json();
    return data.videos && data.videos[0] ? data.videos[0].video_files[0].link : null;
  };

  // Function to handle text submission
  const handleGenerateVideo = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to generate the music video!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const videoUrl = await fetchVideo(inputText);
      if (videoUrl) {
        setVideoLink(videoUrl);
      } else {
        setError('No relevant video found. Please try again.');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setError('Something went wrong while fetching the video. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Music Video Generator</h1>
        <p>Enter any text, and get a high-quality related video!</p>
      </header>

      <main className="app-main">
        <div className="input-container">
          <textarea
            placeholder="Enter text for video..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="4"
            className="text-input"
          ></textarea>
          <button
            onClick={handleGenerateVideo}
            className={`generate-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Video'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {videoLink && (
          <div className="video-container">
            <h2>Your Generated Video</h2>
            <video controls src={videoLink} className="generated-video" />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by AI Video Generation</p>
      </footer>
    </div>
  );
};

export default App;
