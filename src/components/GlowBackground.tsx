import React from "react";

export const GlowBackground = () => {
  return (
    <>
      {/* Background Grid */}
      <div className="tc-bg-grid"></div>

      {/* Decorative Lines */}
      <svg className="tc-deco-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path d="M 100 150 Q 300 150 400 300 Q 500 450 600 400" fill="none" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="6 4" className="tc-dash-anim" opacity="0.5" />
        <path d="M 1100 200 Q 900 200 800 350 Q 700 500 600 400" fill="none" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="6 4" className="tc-dash-anim" opacity="0.5" />
        <path d="M 150 650 Q 350 600 450 500 Q 550 400 600 400" fill="none" stroke="url(#grad3)" strokeWidth="1.5" strokeDasharray="6 4" className="tc-dash-anim" opacity="0.4" />
        <path d="M 1050 650 Q 850 600 750 500 Q 650 400 600 400" fill="none" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="6 4" className="tc-dash-anim" opacity="0.4" />
        <circle cx="450" cy="420" r="4" fill="#8b5cf6" opacity="0.7">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="750" cy="420" r="4" fill="#3b82f6" opacity="0.7">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1100" cy="530" r="5" fill="#06b6d4" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating Particles */}
      <div className="tc-particle" style={{ left: '15%', bottom: '5%', animationDuration: '2.5s', animationDelay: '0s' }}></div>
      <div className="tc-particle" style={{ left: '33%', bottom: '13%', animationDuration: '3s', animationDelay: '0.3s' }}></div>
      <div className="tc-particle" style={{ left: '51%', bottom: '5%', animationDuration: '3.5s', animationDelay: '0.6s' }}></div>
      <div className="tc-particle" style={{ left: '69%', bottom: '13%', animationDuration: '4s', animationDelay: '0.9s' }}></div>
      <div className="tc-particle" style={{ left: '87%', bottom: '5%', animationDuration: '4.5s', animationDelay: '1.2s' }}></div>
    </>
  );
};
