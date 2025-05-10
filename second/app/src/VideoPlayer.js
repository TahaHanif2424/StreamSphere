import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ videoData }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoData) {
      setError("No video data provided");
      setIsLoading(false);
      return;
    }

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    setIsLoading(true);
    setError(null);

    try {
      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: function (xhr, url) {
            try {
              const filename = url?.split('/')?.pop()?.trim();
              if (
                filename &&
                videoData.videoFiles &&
                typeof videoData.videoFiles[filename] === 'string'
              ) {
                xhr.open('GET', videoData.videoFiles[filename], true);
              } else {
                xhr.open('GET', url, true);
              }
            } catch (e) {
              console.error("XHR setup error:", e);
              xhr.open('GET', url, true);
            }
          }
        });

        hlsRef.current = hls;

        if (videoData.masterPlaylist) {
          const blob = new Blob([videoData.masterPlaylist], {
            type: 'application/x-mpegURL',
          });
          const blobUrl = URL.createObjectURL(blob);
          hls.loadSource(blobUrl);
        } else {
          hls.loadSource(videoData.hlsBaseUrl);
        }

        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLevels(hls.levels);
          setCurrentLevel(hls.currentLevel);
          setIsLoading(false);
          videoRef.current
            .play()
            .catch((e) => console.log("Auto-play prevented:", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setError(`HLS error: ${data.type} - ${data.details}`);
            console.error("Fatal HLS error:", data);
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentLevel(data.level);
        });

      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoData.hlsBaseUrl;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      } else {
        setError("HLS is not supported in this browser");
      }
    } catch (err) {
      setError(`Error setting up video: ${err.message}`);
      console.error("Video player error:", err);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (videoData.masterPlaylist && videoRef.current?.src?.startsWith("blob:")) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [videoData]);

  const handleQualityChange = (e) => {
    const level = parseInt(e.target.value);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
  };

  return (
    <div className="video-player-container">
      {isLoading && <div className="loading-overlay">Loading video...</div>}
      {error && <div className="error-message">{error}</div>}

      <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxHeight: '500px', borderRadius: '10px' }}
        playsInline
      />

      {levels.length > 0 && (
        <div className="quality-selector">
          <label htmlFor="quality">Video Quality: </label>
          <select id="quality" value={currentLevel} onChange={handleQualityChange}>
            <option value={-1}>Auto</option>
            {levels.map((level, index) => (
              <option key={index} value={index}>
                {level.height}p ({Math.round(level.bitrate / 1000)} kbps)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
