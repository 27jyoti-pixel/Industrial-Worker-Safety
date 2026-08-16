import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';

const FileUpload = ({
  label,
  onChange,
  multiple = false,
  accept = 'image/*',
  maxSizeMB = 5,
  helperText,
  required = false
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError('');
    // Check file sizes
    const invalidFile = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (invalidFile) {
      setError(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
      return;
    }

    setSelectedFiles(files);
    onChange(multiple ? files : files[0]);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(multiple ? [] : null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-sand-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-sand-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition-all bg-white"
      >
        <UploadCloud className="w-8 h-8 text-brand-600 mb-2" />
        <p className="text-sm font-medium text-sand-700">Click to upload files</p>
        <p className="text-xs text-sand-500 mt-1">{helperText || `Supports JPG, PNG, PDF up to ${maxSizeMB}MB`}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-sand-50 border border-sand-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-brand-600 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-sand-600 shrink-0" />
                )}
                <span className="font-medium text-sand-700 truncate">{file.name}</span>
                <span className="text-sand-400 shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="text-sand-400 hover:text-red-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
