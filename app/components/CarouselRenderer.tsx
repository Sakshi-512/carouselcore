'use client';
import { useEffect, useRef } from 'react';

interface Slide {
  number: number;
  type: string;
  heading: string;
  content: string;
}

interface Props {
  slides: Slide[];
}

export default function CarouselRenderer({ slides }: Props) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    slides.forEach((slide, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Draw template image
        ctx.drawImage(img, 0, 0, 1080, 1080);
        
        // Set text styles
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        
        // Draw heading with more top padding
        ctx.font = 'bold 56px Inter, Arial, sans-serif';
        const headingY = slide.number === 1 ? 500 : 400;
        wrapText(ctx, slide.heading, 80, headingY, 920, 70);
        
        // Draw content with proper bullet point handling
        const contentY = slide.number === 1 ? 650 : 550;
        drawContentWithBullets(ctx, slide.content, 80, contentY, 920);
        
        // Add branding on all slides
        ctx.font = '24px Inter, Arial, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'center';
        ctx.fillText('Created with CarouselCore', 540, 1020);
        ctx.textAlign = 'left'; // Reset
      };
      
      img.src = `/templates/template1/slide${slide.number}.png`;
    });
  }, [slides]);

  // Helper function to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  // Helper function to draw content with proper bullet point formatting
  const drawContentWithBullets = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ) => {
    ctx.font = '36px Inter, Arial, sans-serif';
    const lineHeight = 50;
    const bulletIndent = 50;
    const bulletSymbol = '•';
    let currentY = y;

    // Normalize text - replace different bullet markers and split by newlines
    let normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    
    // Split by newlines first
    let lines = normalizedText.split('\n').filter(line => line.trim());
    
    // If no newlines, try to detect bullet points in the text
    if (lines.length === 1) {
      // Try to split by bullet patterns
      const bulletPattern = /([-•*])\s+/g;
      if (bulletPattern.test(lines[0])) {
        lines = lines[0].split(bulletPattern).filter(part => part.trim() && !/^[-•*]$/.test(part.trim()));
      }
    }
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if line starts with a bullet indicator (after trimming)
      const bulletMatch = trimmedLine.match(/^[-•*]\s+(.+)$/);
      const isBullet = !!bulletMatch;
      const contentText = isBullet ? bulletMatch![1] : trimmedLine;
      
      if (isBullet) {
        // Draw bullet symbol
        ctx.font = '36px Inter, Arial, sans-serif';
        ctx.fillText(bulletSymbol, x, currentY);
        
        // Draw bullet content with wrapping
        const bulletX = x + bulletIndent;
        const bulletMaxWidth = maxWidth - bulletIndent;
        const words = contentText.split(' ');
        let lineText = '';
        
        for (let n = 0; n < words.length; n++) {
          const testLine = lineText + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > bulletMaxWidth && n > 0) {
            ctx.fillText(lineText, bulletX, currentY);
            lineText = words[n] + ' ';
            currentY += lineHeight;
          } else {
            lineText = testLine;
          }
        }
        if (lineText.trim()) {
          ctx.fillText(lineText, bulletX, currentY);
        }
        currentY += lineHeight + 10; // Extra spacing between bullets
      } else {
        // Regular text without bullet - wrap it
        const words = contentText.split(' ');
        let lineText = '';
        
        for (let n = 0; n < words.length; n++) {
          const testLine = lineText + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(lineText, x, currentY);
            lineText = words[n] + ' ';
            currentY += lineHeight;
          } else {
            lineText = testLine;
          }
        }
        if (lineText.trim()) {
          ctx.fillText(lineText, x, currentY);
        }
        currentY += lineHeight;
      }
    });
  };

  const downloadCarousel = async () => {
    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');
    
    const zip = new JSZip();
    
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`slide-${index + 1}.png`, imgData, { base64: true });
      }
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'carousel.zip');
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">
          Your Carousel Preview
        </h2>
        <button
          onClick={downloadCarousel}
          className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Carousel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.number} className="relative">
            <canvas
              ref={(el) => {
                canvasRefs.current[index] = el;
              }}
              width={1080}
              height={1080}
              className="w-full border-4 border-white rounded-xl shadow-2xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}