import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { BillRecord } from '../data';

interface UploadBillProps {
  onUploadComplete: (newBills: BillRecord[]) => void;
}

export default function UploadBill({ onUploadComplete }: UploadBillProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        
        const response = await fetch('/api/extract-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type
          })
        });

        if (!response.ok) {
          throw new Error('Failed to process image');
        }
        
        const data = await response.json();
        if (data.bills && Array.isArray(data.bills)) {
          // Normalize numeric amounts just in case AI returns string
          const normalized = data.bills.map((b: any) => ({
            ...b,
            amount: Number(b.amount) || 0
          }));
          onUploadComplete(normalized);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error extracting bill data. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
        {isUploading ? 'Extracting Data...' : 'Upload Bill Image'}
      </button>
    </div>
  );
}
