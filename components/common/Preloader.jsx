// components/common/Preloader.jsx
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #4b9b97 0%, #3d7d7a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'preloaderFadeIn 0.3s ease-in',
      }}
    >
      <div 
        style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          minWidth: '320px',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '30px', position: 'relative', display: 'inline-block' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle 
                cx="50" 
                cy="50" 
                r="48" 
                stroke="url(#gradient)" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="301"
                strokeDashoffset={301 - (301 * progress) / 100}
                style={{
                  transition: 'stroke-dashoffset 0.3s ease-in-out',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center'
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4b9b97" />
                  <stop offset="100%" stopColor="#6bc4c0" />
                </linearGradient>
              </defs>
            </svg>
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 20px rgba(75, 155, 151, 0.3)',
              animation: 'preloaderPulse 2s ease-in-out infinite',
            }}>
              <Image
                src="/images/logo.png"
                alt="TidyLinking"
                width={50}
                height={50}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{
            display: 'block',
            fontSize: '28px',
            fontWeight: '700',
            color: '#4b9b97',
            marginBottom: '8px',
          }}>
            TidyLinking
          </span>
          <span style={{
            display: 'block',
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '400',
          }}>
            Connecting cleaners with opportunities
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: '#e5e7eb',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '20px',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4b9b97 0%, #6bc4c0 100%)',
            borderRadius: '999px',
            transition: 'width 0.3s ease-in-out',
            width: `${progress}%`,
          }} />
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#4b9b97',
            borderRadius: '50%',
            animation: 'preloaderBounce 1.4s ease-in-out infinite',
            animationDelay: '-0.32s',
          }}></span>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#4b9b97',
            borderRadius: '50%',
            animation: 'preloaderBounce 1.4s ease-in-out infinite',
            animationDelay: '-0.16s',
          }}></span>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#4b9b97',
            borderRadius: '50%',
            animation: 'preloaderBounce 1.4s ease-in-out infinite',
          }}></span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;