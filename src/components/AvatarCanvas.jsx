import React, { useEffect, useState, useRef } from 'react';

export default function AvatarCanvas({ state }) {
  // state: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [blink, setBlink] = useState(false);
  const [mouthScale, setMouthScale] = useState(1);
  const animationRef = useRef(null);

  // Trigger blinks at random intervals
  useEffect(() => {
    let timer;
    const runBlink = () => {
      setBlink(true);
      setTimeout(() => {
        setBlink(false);
      }, 150);
      timer = setTimeout(runBlink, Math.random() * 4000 + 2000);
    };
    timer = setTimeout(runBlink, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Animate mouth when speaking
  useEffect(() => {
    if (state === 'speaking') {
      let angle = 0;
      const animateMouth = () => {
        angle += 0.2;
        // Generate a random-looking wave for lip sync
        const scale = 1 + Math.abs(Math.sin(angle) * 0.8) + (Math.random() * 0.4);
        setMouthScale(scale);
        animationRef.current = requestAnimationFrame(animateMouth);
      };
      animateMouth();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setMouthScale(1);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  // Determine avatar color theme based on state
  const getThemeColor = () => {
    switch (state) {
      case 'listening':
        return {
          primary: '#8b5cf6', // purple
          secondary: '#ec4899', // pink
          glow: 'rgba(139, 92, 246, 0.4)'
        };
      case 'thinking':
        return {
          primary: '#a855f7', // violet
          secondary: '#06b6d4', // cyan
          glow: 'rgba(6, 182, 212, 0.4)'
        };
      case 'speaking':
        return {
          primary: '#10b981', // emerald
          secondary: '#06b6d4', // cyan
          glow: 'rgba(16, 185, 129, 0.4)'
        };
      case 'idle':
      default:
        return {
          primary: '#06b6d4', // cyan
          secondary: '#3b82f6', // blue
          glow: 'rgba(6, 182, 212, 0.3)'
        };
    }
  };

  const colors = getThemeColor();

  return (
    <div className="avatar-section">
      <div className="avatar-container-outer">
        {/* Dynamic Glowing Outer Rings */}
        <div className={`avatar-ring ${state === 'listening' ? 'active' : ''} ${state === 'thinking' ? 'thinking' : ''} ${state === 'speaking' ? 'speaking' : ''}`}></div>
        
        {/* Avatar SVG */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: `drop-shadow(0 0 20px ${colors.glow})`, transition: 'all 0.5s ease', zIndex: 10 }}
        >
          {/* Definitions for Gradients and Filters */}
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
            <radialGradient id="faceCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
              <stop offset="70%" stopColor={colors.secondary} stopOpacity="0.05" />
              <stop offset="100%" stopColor="#080c14" stopOpacity="0" />
            </radialGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Holographic Face Core */}
          <circle cx="90" cy="90" r="70" fill="url(#faceCore)" />

          {/* Outer Mesh Rings */}
          <circle
            cx="90"
            cy="90"
            r="65"
            stroke="url(#avatarGrad)"
            strokeWidth="1.5"
            strokeDasharray={state === 'thinking' ? '20 10 5 10' : '8 6'}
            opacity="0.6"
            style={{
              transformOrigin: '90px 90px',
              animation: state === 'thinking' ? 'rotateRing 3s linear infinite' : 'rotateRing 40s linear infinite'
            }}
          />
          <circle
            cx="90"
            cy="90"
            r="58"
            stroke="url(#avatarGrad)"
            strokeWidth="1"
            strokeDasharray="40 10 20 10"
            opacity="0.3"
            style={{
              transformOrigin: '90px 90px',
              animation: 'rotateRing 25s linear infinite reverse'
            }}
          />

          {/* Inner Interface Rings */}
          <circle cx="90" cy="90" r="48" stroke="url(#avatarGrad)" strokeWidth="0.75" opacity="0.2" />

          {/* AI Face Features: Eyes */}
          {/* Left Eye */}
          <g transform="translate(65, 82)">
            {blink ? (
              <line x1="-8" y1="0" x2="8" y2="0" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="0" cy="0" r="6" fill="#080c14" stroke="url(#avatarGrad)" strokeWidth="2" />
                <circle cx="0" cy="0" r="2" fill={colors.primary} />
                {/* HUD Eye Reticle */}
                <circle cx="0" cy="0" r="10" stroke={colors.primary} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.7" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g transform="translate(115, 82)">
            {blink ? (
              <line x1="-8" y1="0" x2="8" y2="0" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="0" cy="0" r="6" fill="#080c14" stroke="url(#avatarGrad)" strokeWidth="2" />
                <circle cx="0" cy="0" r="2" fill={colors.primary} />
                {/* HUD Eye Reticle */}
                <circle cx="0" cy="0" r="10" stroke={colors.primary} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.7" />
              </>
            )}
          </g>

          {/* Dynamic HUD Mouth / Audio Waveform */}
          <g transform="translate(90, 112)">
            {state === 'speaking' ? (
              // Mouth moving in response to speech (rendered as an animated path/wave)
              <path
                d={`M -20,0 Q -10,${-10 * mouthScale} 0,0 T 20,0`}
                stroke="url(#avatarGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : state === 'listening' ? (
              // Listening state - flat horizontal line that pulses slightly
              <path
                d="M -15,0 Q 0,0 15,0"
                stroke={colors.primary}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
                style={{ transform: 'scaleY(0.5)' }}
              />
            ) : state === 'thinking' ? (
              // Thinking state - a small glowing orbit or ring in the mouth area
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="none"
                stroke="url(#avatarGrad)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                style={{
                  transformOrigin: '0 0',
                  animation: 'rotateRing 2s linear infinite'
                }}
              />
            ) : (
              // Idle state - serene small smile
              <path
                d="M -12,-1 Q 0,4 12,-1"
                stroke="url(#avatarGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
            )}
          </g>

          {/* AI Node Particles */}
          <circle cx="90" cy="20" r="3" fill={colors.primary} opacity="0.8" />
          <line x1="90" y1="20" x2="90" y2="28" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" />

          <circle cx="30" cy="90" r="2.5" fill={colors.secondary} opacity="0.7" />
          <line x1="30" y1="90" x2="38" y2="90" stroke={colors.secondary} strokeWidth="0.5" opacity="0.3" />

          <circle cx="150" cy="90" r="2.5" fill={colors.secondary} opacity="0.7" />
          <line x1="150" y1="90" x2="142" y2="90" stroke={colors.secondary} strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Futuristic Soundwave bars below the avatar */}
      <div className="soundwave-visualizer">
        {[...Array(9)].map((_, i) => {
          const delay = (i * 0.1).toFixed(1);
          let barClass = '';
          if (state === 'speaking') barClass = 'speaking';
          else if (state === 'listening') barClass = 'listening';

          return (
            <div
              key={i}
              className={`soundwave-bar ${barClass}`}
              style={{
                animationDelay: `${delay}s`,
                background: i % 2 === 0 ? 'var(--primary-gradient)' : 'var(--secondary-gradient)',
                // Give some static height variations for nice look
                height: state === 'idle' ? `${5 + (i % 3) * 2}px` : undefined
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
