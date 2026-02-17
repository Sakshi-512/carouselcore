'use client';

import { useState } from 'react';
import AuthModal from '../components/AuthModal';

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 to-slate-800 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">CarouselCore</h1>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-cyan-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Sign In
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-6xl font-bold text-white mb-6">
            Create LinkedIn & Instagram Carousels in 60 Seconds
          </h2>
          <p className="text-2xl text-white/90 mb-8">
            AI-powered carousel generator that turns your ideas into professional, ready-to-post slides
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-cyan-600 px-12 py-4 rounded-lg text-2xl font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Try It Free →
          </button>
          <p className="text-white/70 mt-4">No credit card required • 30 seconds to start</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-white/80">
              Generate 6-slide professional carousels in 60 seconds. No design skills needed.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-3">AI-Powered</h3>
            <p className="text-white/80">
              Advanced AI writes engaging content tailored to your topic and audience.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-3">Professional Templates</h3>
            <p className="text-white/80">
              Multiple template styles. Download ready-to-post PNG files instantly.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm p-10 rounded-xl mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Sign up for free</h4>
                <p className="text-white/80">Create your account in 30 seconds. No credit card required.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Enter your topic</h4>
                <p className="text-white/80">Type any topic and let AI generate professional content.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Download & post</h4>
                <p className="text-white/80">Get 6 ready-to-post slides. Upload to LinkedIn or Instagram immediately.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-cyan-600 px-12 py-4 rounded-lg text-2xl font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Free →
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </main>
  );
}