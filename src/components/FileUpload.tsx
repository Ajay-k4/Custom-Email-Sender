import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import type { UploadedData } from '../types';

interface FileUploadProps {
  onUpload: (data: UploadedData) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const processCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => ({
          ...obj,
          [header]: values[index]?.trim() || ''
        }), {});
      });
    
    const data = { headers, rows };
    onUpload(data);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processCSV(text);
      };
      reader.readAsText(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.google-apps.spreadsheet': ['.gsheet'],
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Data</h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600">
            {isDragActive ? (
              'Drop your file here...'
            ) : (
              <>
                Drag and drop your CSV or spreadsheet file here, or{' '}
                <span className="text-indigo-600 font-medium">click to browse</span>
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: CSV, Excel, Google Sheets
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Or connect Google Sheets</h3>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Connect Google Sheets
          </button>
        </div>
      </div>
    </div>
  );
}