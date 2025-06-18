import {
    FileTextIcon,
    FileType,
    FileType2Icon,
    ImageIcon,
    PaperclipIcon,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export interface FileUpload {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'uploading' | 'completed' | 'error';
    progress: number;
    url?: string;
    base64?: string;
    fileTypeLabel?: string;
    error?: string;
}

// const mimeGroups = {
//     documents: [
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ],
//     images: ['image/jpeg', 'image/png', 'image/gif'],
//     text: ['text/plain', 'text/csv'],
// } satisfies Record<string, readonly string[]>;

const mimeMapping = {
    word: 'application/msword',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    css: 'text/css',
    yaml: 'application/x-yaml',
    yml: 'application/x-yaml',
} as const;

type AllowedMime = keyof typeof mimeMapping; //| (string & {});
type FileUploadMode = 'single' | 'multiple';

interface UseFileUploadProps<T extends FileUploadMode> {
    mode: T;
    onUploadStart?: (file: FileUpload) => void;
    onUploadProgress?: (file: FileUpload) => void;
    onFilesUploaded?: (files: FileUpload[]) => void;
    onUploadError?: (file: FileUpload, error: string) => void;
    maximumFileSize?: number; // in bytes, default is 10MB
    acceptedFileTypes: AllowedMime[]; // default is all mime types
}

export function useFileUpload<T extends FileUploadMode>({
    mode,
    onUploadProgress,
    onFilesUploaded,
    onUploadError,
    maximumFileSize,
    acceptedFileTypes,
}: UseFileUploadProps<T>) {
    const MAX_FILE_SIZE = useMemo(
        () => maximumFileSize || 10 * 1024 * 1024,
        [maximumFileSize],
    );
    const ALLOWED_MIMES = useMemo(
        () =>
            acceptedFileTypes
                ? acceptedFileTypes.map((type) => mimeMapping[type])
                : [],
        // (acceptedFileTypes || Object.values(mimeMapping).flat()).map(String),
        [acceptedFileTypes],
    );
    const htmlAllowedMimes = useMemo(
        () => ALLOWED_MIMES.join(', '),
        [ALLOWED_MIMES],
    );

    const fileTypeLabels = useMemo(
        () => ({
            'application/pdf': 'PDF',
            'application/msword': 'Word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                'Word',
            'image/jpeg': 'Image',
            'image/png': 'Image',
            'image/gif': 'Image',
            'text/plain': 'Text',
            'text/csv': 'CSV',
        }),
        [],
    );

    const [uploads, setUploads] = useState<FileUpload[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);

    const formatFileSize = useCallback((size: number): string => {
        if (size < 0) return '0 B';
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        if (size < 1024 * 1024 * 1024)
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        if (size < 1024 * 1024 * 1024 * 1024)
            return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        return `${(size / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
    }, []);

    const getFileIcon = useCallback((fileType: string) => {
        switch (fileType) {
            case 'application/pdf':
                return FileType2Icon;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return FileTextIcon;
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
                return ImageIcon;
            case 'text/plain':
            case 'text/csv':
                return FileType;
            default:
                return PaperclipIcon;
        }
    }, []);

    const validateFile = useCallback(
        (file: File): string | null => {
            if (file.size > MAX_FILE_SIZE) {
                return `File size exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}.`;
            }
            if (!ALLOWED_MIMES.map(String).includes(file.type)) {
                return `Unsupported file type. Accepted types are: ${ALLOWED_MIMES.join(', ')}.`;
            }
            return null;
        },
        [MAX_FILE_SIZE, ALLOWED_MIMES, formatFileSize],
    );

    const convertBase64 = useCallback(
        (
            file: File,
        ): Promise<{
            name: string;
            base64: string;
            type: string;
            size: number;
        }> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        name: file.name,
                        base64: reader.result as string,
                        type: file.type,
                        size: file.size,
                    });
                };
                reader.onerror = () => {
                    reject('Failed to convert file to base64');
                };
                reader.readAsDataURL(file);
            });
        },
        [],
    );

    const uploadFile = useCallback(
        async (file: FileUpload) => {
            const error = validateFile(file.file);
            // onUploadStart?.(file);
            if (error) {
                const errorFile = {
                    ...file,
                    status: 'error',
                    error,
                } as FileUpload;
                onUploadError?.(errorFile, error);
                setUploads((prev) =>
                    prev.map((f) => (f.id === file.id ? errorFile : f)),
                );
                return Promise.reject(error);
            }

            return new Promise<FileUpload>(async (resolve) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress = Math.min(progress + 10, 100);

                    const updatedFile: FileUpload = {
                        ...file,
                        status: progress < 100 ? 'uploading' : 'completed',
                        progress,
                    };

                    if (progress < 100) {
                        onUploadProgress?.(updatedFile);
                    } else {
                        clearInterval(interval);
                        onFilesUploaded?.([updatedFile]);
                    }

                    setUploads((prev) =>
                        prev.map((f) => (f.id === file.id ? updatedFile : f)),
                    );

                    if (progress === 100) {
                        try {
                            setUploads((prev) =>
                                prev.map((f) =>
                                    f.id === file.id
                                        ? {
                                              ...file,
                                              status: 'completed',
                                              progress: 100,
                                          }
                                        : f,
                                ),
                            );
                            resolve(file);
                        } catch (e) {
                            const errorFile: FileUpload = {
                                ...updatedFile,
                                status: 'error',
                                error: 'Failed to convert',
                            };
                            setUploads((prev) =>
                                prev.map((f) =>
                                    f.id === file.id ? errorFile : f,
                                ),
                            );
                            onUploadError?.(errorFile, 'Failed to convert');
                        }
                    }
                }, 500);
            });
        },
        [
            validateFile,
            onUploadProgress,
            onFilesUploaded,
            onUploadError,
            convertBase64,
        ],
    );

    const handleFiles = useCallback(
        async (files: FileList) => {
            const newFiles: FileUpload[] = [];

            for (let [_, file] of Array.from(files).entries()) {
                const AlreadyExist = uploads.find(
                    (f) => f.name === file.name && f.size === file.size,
                );
                if (AlreadyExist) {
                    console.warn(
                        `File ${file.name} already exists in uploads. Skipping.`,
                    );
                    continue;
                }
                const base64 = await convertBase64(file).catch(
                    () => undefined,
                )!;
                newFiles.push({
                    id: crypto.randomUUID(),
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    status: 'uploading',
                    progress: 0,
                    fileTypeLabel:
                        (fileTypeLabels as any)[file.type] || 'Unknown',
                    base64: base64!.base64,
                    url: URL.createObjectURL(file),
                });
            }

            setUploads((prev) =>
                mode === 'single' && newFiles.length > 0
                    ? [newFiles[0]]
                    : [...prev, ...newFiles],
            );

            // Start uploading each file
            newFiles.forEach((file) => {
                uploadFile(file).catch(console.error);
            });
        },
        [mode, uploadFile, fileTypeLabels],
    );

    const handleDragEvents = useMemo(
        () => ({
            onDrop: (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(false);
                if (e.dataTransfer.files?.length)
                    handleFiles(e.dataTransfer.files);
            },
            onDragOver: (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(true);
            },
            onDragLeave: (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(false);
            },
        }),
        [handleFiles],
    );

    const removeFile = useCallback(
        (id: string) => {
            setUploads((prev) => prev.filter((f) => f.id !== id));
            onFilesUploaded?.(uploads.filter((f) => f.id !== id));
        },
        [uploads, onFilesUploaded],
    );

    const retryUpload = useCallback(
        (id: string) => {
            setUploads((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                              ...f,
                              status: 'uploading',
                              progress: 0,
                              error: undefined,
                          }
                        : f,
                ),
            );
            const fileToRetry = uploads.find((f) => f.id === id);
            if (fileToRetry) {
                uploadFile(fileToRetry).catch(console.error);
            }
        },
        [uploads, uploadFile],
    );

    const downloadFile = useCallback((fileUpload: FileUpload) => {
        if (fileUpload.url) {
            const link = document.createElement('a');
            link.href = fileUpload.url;
            link.download = fileUpload.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, []);

    const previewFile = useCallback((fileUpload: FileUpload) => {
        if (fileUpload.url && fileUpload.type.startsWith('image/')) {
            window.open(fileUpload.url, '_blank');
        }
    }, []);

    return {
        uploads,
        isDragActive,
        setIsDragActive,
        handleFiles,
        uploadFile,
        validateFile,
        MAX_FILE_SIZE: formatFileSize(MAX_FILE_SIZE),
        ALLOWED_MIMES,
        getFileIcon,
        formatFileSize,
        handleDrop: handleDragEvents.onDrop,
        handleDragOver: handleDragEvents.onDragOver,
        handleDragLeave: handleDragEvents.onDragLeave,
        removeFile,
        retryUpload,
        downloadFile,
        previewFile,
        htmlAllowedMimes,
        acceptedFileTypes,
    };
}
