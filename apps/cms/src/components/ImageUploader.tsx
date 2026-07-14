'use client';

import { useRef, useState } from 'react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  multiple?: boolean;
}

export default function ImageUploader({ images, onChange, label = '图片', multiple = true }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const token = localStorage.getItem('auth_token');
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
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
      onChange([...images, ...uploadedUrls]);
    } else {
      onChange(uploadedUrls.length > 0 ? [uploadedUrls[0]] : images);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img src={`http://localhost:4000${url}`} alt={`${label} ${index + 1}`} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        {(multiple || images.length === 0) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#0047AB] hover:text-[#0047AB] transition-colors"
          >
            {uploading ? (
              <span className="text-sm">上传中...</span>
            ) : (
              <>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">添加图片</span>
              </>
            )}
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple={multiple} onChange={handleUpload} className="hidden" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
