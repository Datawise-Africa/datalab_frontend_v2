import { useState, useCallback, type DragEvent } from 'react';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxFiles = 10,
    maxSizeBytes = 100 * 1024 * 1024,
    acceptedTypes,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeBytes) {
        return `File "${file.name}" exceeds the maximum size of ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB`;
      }
      if (acceptedTypes && !acceptedTypes.some((t) => file.type.includes(t))) {
        return `File "${file.name}" has an unsupported type`;
      }
      return null;
    },
    [maxSizeBytes, acceptedTypes]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      setFiles((prev) => {
        const combined = [
          ...prev,
          ...fileArray.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        ];
        if (combined.length > maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          return prev;
        }
        return combined;
      });
    },
    [maxFiles, validateFile]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  return {
    files,
    isDragging,
    error,
    addFiles,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
