'use client';

import { useRef, useState } from 'react';

interface FileUploaderProps {
  files: string[];
  onChange: (files: string[]) => void;
  label?: string;
  multiple?: boolean;
}

export default function FileUploader({ files, onChange, label = '文档', multiple = true }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    const token = localStorage.getItem('auth_token');
    const uploadedUrls: string[] = [];

    for (const file of Array.from(selectedFiles)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('http://localhost:4000/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        }
      } catch {
        setError('上传失败');
      }
    }

    if (multiple) {
      onChange([...files, ...uploadedUrls]);
    } else {
      onChange(uploadedUrls.length > 0 ? [uploadedUrls[0]] : files);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2 mb-3">
        {files.map((url, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md group">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <a
                href={`http://localhost:4000${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0047AB] hover:underline truncate block"
              >
                {getFileName(url)}
              </a>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {(multiple || files.length === 0) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-[#0047AB] hover:text-[#0047AB] transition-colors"
          >
            {uploading ? (
              <span className="text-sm">上传中...</span>
            ) : (
              <>
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs">上传文档 (PDF/Word/Excel/PPT)</span>
              </>
            )}
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" multiple={multiple} onChange={handleUpload} className="hidden" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
