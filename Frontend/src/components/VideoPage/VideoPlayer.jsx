import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ videoData }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoData) {
      setError('No video data provided');
      setIsLoading(false);
      return;
    }

    // Cleanup previous Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    setIsLoading(true);
    setError(null);

    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup(xhr, url) {
            xhr.open('GET', url, true);
          }
        });
        hlsRef.current = hls;

        // load source (masterPlaylist or base URL)
        if (videoData.masterPlaylist) {
          const blob = new Blob([videoData.masterPlaylist], { type: 'application/vnd.apple.mpegurl' });
          const blobUrl = URL.createObjectURL(blob);
          hls.loadSource(blobUrl);
        } else {
          hls.loadSource(videoData.hlsBaseUrl || videoData.URL);
        }

        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLevels(hls.levels);
          setCurrentLevel(hls.currentLevel);
          setIsLoading(false);
          videoRef.current.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setError(`HLS error: ${data.type} - ${data.details}`);
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentLevel(data.level);
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoData.hlsBaseUrl || videoData.URL;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      } else {
        setError('HLS is not supported in this browser');
      }
    };

    setupHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (videoData.masterPlaylist && videoRef.current?.src?.startsWith('blob:')) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [videoData]);

  const handleQualityChange = (e) => {
    const level = parseInt(e.target.value, 10);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
  };

  return (
    <div className="video-player-container relative">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">Loading video...</div>}
      {error && <div className="text-red-500 p-4">{error}</div>}

      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg shadow-lg bg-black"
        style={{ aspectRatio: '16/9' }}
        playsInline
      />

      {levels.length > 0 && (
        <div className="mt-2 flex items-center space-x-2">
          <label htmlFor="quality" className="text-sm text-gray-700">Quality:</label>
          <select
            id="quality"
            value={currentLevel}
            onChange={handleQualityChange}
            className="px-2 py-1 border rounded"
          >
            <option value={-1}>Auto</option>
            {levels.map((lvl, idx) => (
              <option key={idx} value={idx}>
                {lvl.height}p ({Math.round(lvl.bitrate/1000)} kbps)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}