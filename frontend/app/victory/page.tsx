"use client";

import { useState, useEffect } from 'react';

export default function ProjectOverviewPage() {
  const [content, setContent] = useState<string | null>(null);

  const fetchProjectOverviewContent = async () => {
    try {
      const res = await fetch(`/victory/getMarkdownContent?filename=1._project_overview`);
      if (!res.ok) throw new Error("Failed to fetch content.");
      const data = await res.json();
      setContent(data.html || "<p>No content available.</p>");
    } catch (error) {
      console.error("Error fetching markdown content:", error);
      setContent("<p>Unable to load content.</p>");
    }
  };

  // Load "Project Overview" content initially
  useEffect(() => {
    fetchProjectOverviewContent();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#270b36] p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Project Overview</h1>
      {content ? (
        <div className="max-w-3xl" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-gray-400">Loading content...</p>
      )}
    </div>
  );
}
