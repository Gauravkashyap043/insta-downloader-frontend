import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://insta-downloader-backend.onrender.com/api/download?url=${encodeURIComponent(url)}`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        setMediaItems(response.data.media);
      } else {
        setError(response.data.message || 'No media found');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message
        || err.message
        || 'Failed to fetch media';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Insta Downloader</h1>

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder="Paste Instagram URL here"
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
        />
        <button
          onClick={handleDownload}
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Download'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {mediaItems.map((item, index) => (
          <div key={index} style={styles.mediaCard}>
            {item.type === 'video' ? (
              <video
                controls
                style={styles.media}
                poster={item.thumbnail}
              >
                <source src={item.url} type="video/mp4" />
                Your browser doesn't support videos
              </video>
            ) : (
              <img
                src={item.url}
                alt={`Instagram media ${index + 1}`}
                style={styles.media}
                onError={(e) => {
                  e.target.src = item.thumbnail;
                }}
              />
            )}
            <a
              href={item.url}
              download
              style={styles.downloadLink}
            >
              Download {item.type}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center'
  },
  input: {
    padding: '12px',
    width: '400px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#0095f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    ':disabled': {
      backgroundColor: '#b2dffc',
      cursor: 'not-allowed'
    }
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  },
  mediaCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  media: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderBottom: '1px solid #eee'
  },
  downloadLink: {
    display: 'block',
    padding: '12px',
    textAlign: 'center',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default App;