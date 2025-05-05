import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropZone({ setFiles }) {
  const [imageURL, setImageURL] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    let image = null;
    let video = null;

    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/') && !image) {
        image = file;
        const reader = new FileReader();
        reader.onload = () => setImageURL(reader.result);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/') && !video) {
        video = file;
        const reader = new FileReader();
        reader.onload = () => setVideoURL(reader.result);
        reader.readAsDataURL(file);
      }
    });

    setFiles({ image, video });
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-blue-400 rounded-md p-6 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200 space-y-4"
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {(imageURL || videoURL) && (
          <div className="flex gap-4 flex-wrap justify-center">
            {imageURL && (
              <div className="w-40 h-40 overflow-hidden rounded-lg shadow-md border border-blue-200">
                <img
                  src={imageURL}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {videoURL && (
              <div className="w-40 h-40 overflow-hidden rounded-lg shadow-md border border-blue-200">
                <video
                  src={videoURL}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        <div>
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop your image and video files here...</p>
          ) : (
            <p className="text-gray-700">
              Drag & drop <span className="text-blue-500 font-semibold">one image</span> and{" "}
              <span className="text-blue-500 font-semibold">one video</span> here, or click to select.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
