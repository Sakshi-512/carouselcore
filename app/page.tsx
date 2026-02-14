'use client';
import { useState } from 'react';
import CarouselRenderer from './components/CarouselRenderer';

interface Slide {
  number: number;
  type: string;
  heading: string;
  content: string;
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCarousel = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setSlides(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          keyPoints: keyPoints.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate carousel');
      }

      const data = await response.json();
      setSlides(data.slides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-500 drop-shadow-lg">
              CarouselCore
            </span>
          </h1>
          <p className="text-2xl text-white/90">
            AI-powered carousel maker
          </p>
        </div>

        {/* Top Banner */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-white text-lg">
            🚀 Pro version launching next week! 
            <a 
              href="https://tally.so/r/zxD9lk" 
              target="_blank"
              className="underline ml-2 font-semibold hover:text-cyan-300"
            >
              Join waitlist →
            </a>
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Carousel Topic *
              </label>
              <input
                type="text"
                placeholder="e.g., '5 productivity tips for remote workers'"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none text-lg text-black"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Key Points (Optional)
              </label>
              <textarea
                placeholder="e.g., time blocking, deep work, breaks, tools"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none text-lg h-24 resize-none text-black"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              onClick={generateCarousel}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xl font-bold py-4 rounded-lg hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Generate Carousel
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L14.09 8.26L22 10L14.09 11.74L12 20L9.91 11.74L2 10L9.91 8.26L12 0Z" opacity="0.9"/>
                    <path d="M19 3L19.5 5.5L22 6L19.5 6.5L19 9L18.5 6.5L16 6L18.5 5.5L19 3Z" opacity="0.7"/>
                    <path d="M5 15L5.3 16.3L6.6 16.6L5.3 16.9L5 18.2L4.7 16.9L3.4 16.6L4.7 16.3L5 15Z" opacity="0.8"/>
                  </svg>
                </span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {slides && !error && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Carousel generated successfully! Scroll down to preview.
            </div>
          )}
        </div>

        {/* Results */}
        {slides && (
          <CarouselRenderer slides={slides} />
        )}
      </div>
    </main>
  );
}