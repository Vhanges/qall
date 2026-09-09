"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface LazyVideoProps {
  /**
   * Path to optimized MP4 video (in /public/videos/optimized/)
   */
  src: string;

  /**
   * Path to poster image (in /public/images/posters/)
   */
  poster?: string;

  /**
   * Alt text for accessibility
   */
  alt: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Load video immediately without lazy loading
   * Use for hero/above-fold videos
   */
  priority?: boolean;

  /**
   * Play video on hover (desktop only)
   */
  playOnHover?: boolean;

  /**
   * Autoplay when in viewport
   */
  autoplay?: boolean;

  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;

  /**
   * Timestamp (in seconds) to freeze on after playing once
   * If provided, video plays once to this point then freezes
   * Useful for matching poster frame timestamp
   * Example: posterTimestamp={5.2} - freezes at 5.2 seconds
   */
  posterTimestamp?: number;

  /**
   * Play video once then freeze on poster frame
   * Combines with posterTimestamp for smooth intro animation
   */
  playOnce?: boolean;

  /**
   * Delay in seconds before looping the video again
   * Example: loopDelay={20} plays video, waits 20s, then plays again
   */
  loopDelay?: number;
}

export function LazyVideo({
  src,
  poster = "",
  alt,
  className = "",
  priority = false,
  playOnHover = false,
  autoplay = true,
  showSkeleton = true,
  posterTimestamp,
  playOnce = false,
  loopDelay,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority videos start in view
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showVideo, setShowVideo] = useState(priority);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasReachedTimestampRef = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Reset timestamp ref and video state on component mount
  useEffect(() => {
    // Reset ref on every mount (page refresh, navigation, etc.)
    hasReachedTimestampRef.current = false;
    setHasPlayedOnce(false);

    // Reset video position if posterTimestamp is set
    if (videoRef.current && posterTimestamp !== undefined) {
      videoRef.current.currentTime = 0;
    }
  }, []); // Empty array = runs on every mount

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShowVideo(true);
          } else {
            setIsInView(false);
            // Unload video when far out of view to save memory
            if (entry.boundingClientRect.top > window.innerHeight * 2 ||
                entry.boundingClientRect.bottom < -window.innerHeight) {
              setShowVideo(false);
            }
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Handle poster timestamp - freeze video at specific time
  useEffect(() => {
    if (!videoRef.current || !posterTimestamp) return;

    const handleTimeUpdate = () => {
      if (!videoRef.current || hasReachedTimestampRef.current) return;

      // If we've reached or passed the poster timestamp, pause and seek to exact frame
      if (videoRef.current.currentTime >= posterTimestamp) {
        hasReachedTimestampRef.current = true; // Immediate sync update to prevent race condition
        videoRef.current.pause();
        videoRef.current.currentTime = posterTimestamp;

        if (playOnce) {
          setHasPlayedOnce(true); // Still update state for UI
        }
      }
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [posterTimestamp, playOnce]);

  // Handle delayed loop - play video, wait, then play again
  useEffect(() => {
    if (!videoRef.current || !loopDelay || !isInView || !isLoaded || prefersReducedMotion) return;

    const video = videoRef.current;

    const handleVideoEnded = () => {
      // Video finished playing, schedule next play after delay
      loopTimeoutRef.current = setTimeout(() => {
        if (video && isInView) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }, loopDelay * 1000);
    };

    video.addEventListener('ended', handleVideoEnded);

    // Start first play
    if (video.paused) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('ended', handleVideoEnded);
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, [loopDelay, isInView, isLoaded, prefersReducedMotion]);

  // Autoplay when in view (if not reduced motion and no loop delay)
  useEffect(() => {
    if (!videoRef.current || !autoplay || prefersReducedMotion || loopDelay) return;

    // If playOnce is enabled and we've already played, don't play again
    if (playOnce && hasReachedTimestampRef.current) return;

    if (isInView && isLoaded) {
      videoRef.current.play().catch(() => {
        // Autoplay failed (browser policy), ignore
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView, isLoaded, autoplay, prefersReducedMotion, posterTimestamp, playOnce, hasPlayedOnce, loopDelay]);

  // Play on hover (desktop only)
  const handleMouseEnter = () => {
    if (!playOnHover || !videoRef.current || prefersReducedMotion) return;
    if (window.matchMedia("(pointer: fine)").matches) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!playOnHover || !videoRef.current) return;
    videoRef.current.pause();
    if (autoplay && isInView && !prefersReducedMotion) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster Image - Show before video loads OR after playOnce completes */}
      {poster && (!isLoaded || (playOnce && hasPlayedOnce)) && (
        <div className="absolute inset-0">
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
          {showSkeleton && !hasPlayedOnce && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          )}
        </div>
      )}

      {/* Video - Lazy loaded */}
      {showVideo && !prefersReducedMotion && (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loop={!playOnce && !loopDelay} // Don't loop if playOnce or loopDelay is enabled
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          {...(poster ? { poster } : {})}
          onLoadedData={() => {
            setIsLoaded(true);
            // Reset state when video loads (handles page refresh with cached video)
            hasReachedTimestampRef.current = false;
            setHasPlayedOnce(false);
            if (videoRef.current && posterTimestamp !== undefined) {
              videoRef.current.currentTime = 0;
            }
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback for reduced motion - show poster only */}
      {prefersReducedMotion && isLoaded && poster && (
        <Image
          src={poster}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      )}
    </div>
  );
}
