import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { FaCog, FaPause, FaPlay, FaForward, FaBackward } from 'react-icons/fa';

export default function VideoPlayer({ videoData }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    if (!videoData) {
      setError('No video data provided');
      setIsLoading(false);
      return;
    }

    if (hlsRef.current) hlsRef.current.destroy();
    setIsLoading(true);
    setError(null);

    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup(xhr, url) { xhr.open('GET', url, true); }
        });
        hlsRef.current = hls;
        const source = videoData.masterPlaylist
          ? URL.createObjectURL(new Blob([videoData.masterPlaylist], { type: 'application/vnd.apple.mpegurl' }))
          : videoData.hlsBaseUrl || videoData.URL;
        hls.loadSource(source);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLevels(hls.levels);
          setCurrentLevel(hls.currentLevel);
          setIsLoading(false);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError(`HLS error: ${data.type} - ${data.details}`);
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentLevel(data.level);
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoData.hlsBaseUrl || videoData.URL;
        videoRef.current.onloadedmetadata = () => setIsLoading(false);
      } else {
        setError('HLS is not supported in this browser');
      }
    };

    setupHls();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [videoData]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Seek forward/backward
  const seek = (offset) => {
    if (videoRef.current) videoRef.current.currentTime += offset;
  };

  // Change quality
  const handleQualityChange = (level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
      setShowQualityMenu(false);
    }
  };

  return (
    <div className="relative group">
      {/* Video Element */}
      <video
        ref={videoRef}
        controls={false}
        className="w-full rounded-lg shadow-lg bg-black"
        style={{ aspectRatio: '16/9' }}
        playsInline
      />

      {/* Loading & Error */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">Loading...</div>
      )}
      {error && <div className="absolute inset-0 p-4 text-red-500 bg-black bg-opacity-50">{error}</div>}

      {/* Overlay Controls: show on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => seek(-10)} className="p-2 mx-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">
          <FaBackward size={20} />
        </button>
        <button onClick={togglePlay} className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">
          {isPlaying ? <FaPause size={24}/> : <FaPlay size={24}/>}    
        </button>
        <button onClick={() => seek(10)} className="p-2 mx-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">
          <FaForward size={20} />
        </button>
      </div>

      {/* Quality Button */}
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => setShowQualityMenu(!showQualityMenu)}
          className="p-1 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-75"
        >
          <FaCog size={16} />
        </button>
        {showQualityMenu && (
          <div className="mt-1 bg-black bg-opacity-75 text-white rounded shadow-lg">
            <button
              onClick={() => handleQualityChange(-1)}
              className="block px-3 py-1 text-left w-full hover:bg-gray-700"
            >Auto</button>
            {levels.map((lvl, idx) => (
              <button
                key={idx}
                onClick={() => handleQualityChange(idx)}
                className="block px-3 py-1 text-left w-full hover:bg-gray-700"
              >
                {lvl.height}p
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}