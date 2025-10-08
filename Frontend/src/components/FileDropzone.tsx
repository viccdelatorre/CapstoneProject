import React, { useCallback, useState } from 'react';

interface FileDropzoneProps {
  accept: string;
  maxSizeBytes: number;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  progress?: number;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  maxSizeBytes,
  onFilesSelected,
  multiple = false,
  className = '',
  error,
  disabled = false,
  progress,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const validateFiles = (files: FileList): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    const acceptedTypes = accept.split(',').map(type => type.trim());

    Array.from(files).forEach(file => {
      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        errors.push(`${file.name}: Invalid file type. Accepted: ${accept}`);
        return;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        errors.push(`${file.name}: File too large. Max size: ${maxSizeMB}MB`);
        return;
      }

      valid.push(file);
    });

    return { valid, errors };
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (disabled) return;

    const { valid, errors } = validateFiles(e.dataTransfer.files);
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      // You might want to call an onError callback here
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  }, [disabled, accept, maxSizeBytes, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;

    const { valid, errors } = validateFiles(e.target.files);
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }

    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver && !disabled ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Choose files"
        />
        
        <div className="space-y-2">
          <svg
            className={`mx-auto h-12 w-12 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`font-medium ${disabled ? 'text-gray-400' : 'text-primary-600'}`}>
              Click to upload
            </span>
            {!disabled && ' or drag and drop'}
          </div>
          
          <p className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {accept} up to {(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB
          </p>
        </div>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% uploaded</p>
          </div>
        )}
      </div>

      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};