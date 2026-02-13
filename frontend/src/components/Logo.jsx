import React from 'react';

const Logo = ({ size = 60, className = '', color = '#cc0000' }) => {
    // Determine heart and rhythm line colors for high contrast
    const isWhiteLogo = color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white';
    const heartColor = isWhiteLogo ? '#ffffff' : color;
    const rhythmColor = isWhiteLogo ? '#cc0000' : '#ffffff'; // Red line on white heart, white line on red heart

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <style>
                {`
          @keyframes heart-beat {
            0% { transform: scale(1); }
            10% { transform: scale(1.15); }
            20% { transform: scale(1); }
            30% { transform: scale(1.2); }
            50% { transform: scale(1); }
          }
          @keyframes rhythm-flow {
            0% { stroke-dashoffset: 100; opacity: 0.4; }
            50% { stroke-dashoffset: 0; opacity: 1; }
            100% { stroke-dashoffset: -100; opacity: 0.4; }
          }
          .beating-heart {
            transform-origin: center;
            animation: heart-beat 1.5s ease-in-out infinite;
          }
          .rhythm-line {
            stroke-dasharray: 100;
            animation: rhythm-flow 3s linear infinite;
          }
        `}
            </style>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-md"
            >
                <defs>
                    <filter id="premium-glow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* The Heart */}
                <path
                    className="beating-heart"
                    d="M50 85 C50 85 15 65 15 40 C15 25 30 15 45 25 C47 27 50 30 50 30 C50 30 53 27 55 25 C70 15 85 25 85 40 C85 65 50 85 50 85 Z"
                    fill={heartColor}
                    filter="url(#premium-glow)"
                />

                {/* EKG Rhythm Line */}
                <path
                    className="rhythm-line"
                    d="M10 50 L35 50 L40 35 L45 65 L50 20 L55 80 L60 45 L65 55 L90 55"
                    stroke={rhythmColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Glossy Reflection (only on red heart for premium feel) */}
                {!isWhiteLogo && (
                    <path
                        d="M30 35 Q35 25 45 28"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.4"
                    />
                )}
            </svg>
            <span
                className="font-black tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                    color: heartColor,
                    fontSize: size * 0.28,
                    fontFamily: '"Montserrat", sans-serif',
                    marginTop: '8px',
                    textShadow: isWhiteLogo ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                LifeFlow
            </span>
        </div>
    );
};

export default Logo;
