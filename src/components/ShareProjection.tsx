"use client";

import { useState } from 'react';
import { useProjection } from '@/context/ProjectionContext';

export default function ShareProjection() {
  const { currentProjectionId, generateShareableLink } = useProjection();
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate a shareable link
  const handleGenerateLink = async () => {
    if (!currentProjectionId) return;
    
    setIsGenerating(true);
    try {
      const link = await generateShareableLink(currentProjectionId);
      setShareableLink(link);
    } catch (error) {
      console.error('Error generating shareable link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!shareableLink) return;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Share Projection</h2>
      
      {!currentProjectionId ? (
        <p className="text-gray-600">
          You need to save a projection before you can share it.
        </p>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Generate a shareable link that allows clients to view this projection without editing capabilities.
          </p>
          
          {!shareableLink ? (
            <button
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isGenerating ? 'Generating...' : 'Generate Shareable Link'}
            </button>
          ) : (
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This link will expire in 30 days. Anyone with this link can view but not edit the projection.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}