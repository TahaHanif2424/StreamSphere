import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const demoVideo = {
    title: 'Test Video',
    hlsBaseUrl: 'https://stream-sphere.s3.amazonaws.com/videos/8015ec43c492e552/master.m3u8',
    channelName: 'Demo Channel',
    channelImageURL: null,
    description: 'This is a test video stream from S3.',
    _id: 'test-video-id'
  };

  setVideos([demoVideo]);
  setSelectedVideo(demoVideo);
  setLoading(false);
}, []);


  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    document.getElementById('video-player-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Streaming Video Platform</h1>
      </header>

      <div className="content-container">
        <section id="video-player-section" className="video-player-section">
          {loading ? (
            <div className="loading">Loading videos...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : selectedVideo ? (
            <div>
              <h2>{selectedVideo.title}</h2>
              <div className="video-player-wrapper">
                <VideoPlayer videoData={{
                  hlsBaseUrl: selectedVideo.hlsBaseUrl
                }} />
              </div>

              <div className="video-details">
                <div className="channel-info">
                  {selectedVideo.channelImageURL && (
                    <img 
                      src={selectedVideo.channelImageURL} 
                      alt={selectedVideo.channelName} 
                      className="channel-image"
                    />
                  )}
                  <h3>{selectedVideo.channelName}</h3>
                </div>
                <p className="description">{selectedVideo.description}</p>
              </div>
            </div>
          ) : (
            <div className="no-video">Select a video to play</div>
          )}
        </section>

        <section className="video-list-section">
          <h2>Available Videos</h2>
          {videos.length > 0 ? (
            <div className="video-grid">
              {videos.map((video) => (
                <div 
                  key={video._id} 
                  className={`video-item ${selectedVideo?._id === video._id ? 'selected' : ''}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="thumbnail-container">
                    <div className="thumbnail-placeholder">
                      <span>Preview</span>
                    </div>
                  </div>
                  <div className="video-item-details">
                    <h3>{video.title}</h3>
                    <p className="channel-name">{video.channelName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="no-videos">No videos available</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
