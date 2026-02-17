'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Your existing generator state
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [slides, setSlides] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setLoading(false);
      } else {
        // Not logged in, redirect to landing
        router.push('/landing');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.push('/landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/landing');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    setSlides([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keyPoints }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setSlides(data.slides);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-slate-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">CarouselCore</h1>
          <div className="flex items-center gap-4">
            <span className="text-white/90">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            AI-powered carousel maker
          </h2>
          <p className="text-gray-600 mb-6">
            Generate professional LinkedIn & Instagram carousels in seconds
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Carousel Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                placeholder="e.g., 10 LinkedIn growth tips"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Key Points (Optional)
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                rows={3}
                placeholder="e.g., time blocking, deep work, breaks, tools"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-cyan-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Carousel ✨'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {slides.length > 0 && !error && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Carousel generated successfully! Scroll down to preview.
            </div>
          )}
        </div>

        {/* Carousel Preview */}
        {slides.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Your Carousel Preview</h2>
              <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-700 transition">
                📥 Download Carousel
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {slides.map((slide, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {slide.number}
                    </div>
                    <span className="text-sm font-medium text-gray-600 uppercase">
                      {slide.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {slide.heading}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {slide.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}