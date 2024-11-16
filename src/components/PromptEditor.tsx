import React, { useState } from 'react';
import { Wand2, Send } from 'lucide-react';

export default function PromptEditor() {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [availableFields] = useState([
    'companyName',
    'location',
    'email',
    'products',
    'contactPerson',
  ]);

  const insertField = (field: string) => {
    setPrompt((current) => `${current}{${field}}`);
  };

  const generatePreview = () => {
    let previewText = prompt;
    availableFields.forEach(field => {
      previewText = previewText.replace(
        new RegExp(`{${field}}`, 'g'),
        `[Sample ${field}]`
      );
    });
    setPreview(previewText);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Composer</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                rows={8}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write your email template here. Use {field} to insert dynamic content..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute right-2 bottom-2 space-x-2">
                <button
                  onClick={generatePreview}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Wand2 className="h-4 w-4 mr-1" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Available Fields</h3>
            <div className="flex flex-wrap gap-2">
              {availableFields.map((field) => (
                <button
                  key={field}
                  onClick={() => insertField(field)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Subject</h3>
              <p className="mt-1 text-sm text-gray-900">{subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Body</h3>
              <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap border rounded-md p-4 bg-gray-50">
                {preview}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}