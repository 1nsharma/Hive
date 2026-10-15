import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, ExternalLink, Check, Image as ImageIcon } from 'lucide-react';

interface SEOScreenshotImageProps {
  targetUrl: string;
  pageTitle: string;
  className?: string;
  showCaption?: boolean;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

export function SEOScreenshotImage({
  targetUrl,
  pageTitle,
  className = '',
  showCaption = true,
  aspectRatio = '16/9'
}: SEOScreenshotImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchScreenshot = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/screenshot?url=${encodeURIComponent(targetUrl)}&title=${encodeURIComponent(pageTitle)}${forceRefresh ? '&refresh=true' : ''}`
      );
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setIsCached(Boolean(data.cached));
      } else {
        // Fallback fallback URL
        setImageUrl(`/screenshots/${pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`);
      }
    } catch (err) {
      console.warn('Screenshot fetch error:', err);
      // Fallback path
      setImageUrl(`/screenshots/${pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenshot();
  }, [targetUrl, pageTitle]);

  const altText = `${pageTitle} का स्क्रीनशॉट — PetJanu`;

  return (
    <figure className={`relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 group shadow-lg ${className}`}>
      {/* Aspect Ratio Container */}
      <div 
        className="relative w-full bg-stone-950 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: aspectRatio.replace('/', ' / ') }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center p-6 text-stone-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <span className="text-xs font-mono">Generatting WebP Screenshot...</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={altText}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            onError={(e) => {
              // Graceful SVG error fallback
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}

        {/* Floating WebP & Cache Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-stone-900/90 text-amber-400 text-[10px] font-mono font-bold border border-amber-400/30 backdrop-blur-md">
            WEBP (SEO Optimized)
          </span>
          {isCached && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-400/30 backdrop-blur-md">
              ⚡ CACHED
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fetchScreenshot(true)}
            title="Re-generate Screenshot"
            className="p-1.5 rounded-lg bg-stone-900/80 text-white hover:bg-stone-800 border border-stone-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View Full Resolution WebP Image"
            className="p-1.5 rounded-lg bg-stone-900/80 text-white hover:bg-stone-800 border border-stone-700 transition cursor-pointer flex items-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SEO Caption & Alt Text Info */}
      {showCaption && (
        <figcaption className="p-3 bg-stone-900 text-stone-300 text-xs flex items-center justify-between border-t border-stone-800 font-sans">
          <div className="flex items-center gap-2 overflow-hidden">
            <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-stone-200 font-medium">
              Alt: <code className="text-amber-300 font-mono text-[11px]">&quot;{altText}&quot;</code>
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono shrink-0">
            sitemap.xml synced
          </span>
        </figcaption>
      )}
    </figure>
  );
}
