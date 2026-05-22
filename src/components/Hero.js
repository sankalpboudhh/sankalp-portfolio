import { useEffect, useRef } from 'react';
import { Typed } from 'react-typed';
import profilePic from '../assets/profile.png';
import overlayPic from '../assets/overlay.png'
import './Hero.css';

function Hero() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Frontend Developer', 'React.js Developer', 'UI Engineer', 'Ex-Founder'],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1800,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <>
      {/* Left sidebar social icons */}
      <div className="social-sidebar">
        <a href="https://github.com/sankalpboudhh" target="_blank" rel="noreferrer" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <a href="https://linkedin.com/in/sankalp-boudhh" target="_blank" rel="noreferrer" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a href="mailto:sankalpboudhh@gmail.com" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
          </svg>
        </a>
        <div className="sidebar-line" />
      </div>

      <section className="hero" id="hero">
        <div className="hero-left">
          <div className="hero-tag">Available for work</div>
          <p className="hero-greeting">Hello, my name is</p>
          <h1 className="hero-name">Sankalp Boudhh</h1>
          <p className="hero-typed">
            I'm a <span className="typed-accent" ref={typedRef} />
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn-primary">View my work →</a>
            <a href="mailto:sankalpboudhh@gmail.com" className="btn-outline">Get in touch</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-photo-wrap">
            <div className="hero-photo-circle " >
            <img src={profilePic} alt="Sankalp Boudhh" className="hero-photo" ></img>
            <img src={overlayPic} className="overlaypic  zoom"></img>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-stats-bar">
        <div className="stat">
          <div className="stat-num">3+</div>
          <div className="stat-label">Years experience</div>
        </div>
        <div className="stat">
          <div className="stat-num">800+</div>
          <div className="stat-label">Dealerships served</div>
        </div>
        <div className="stat">
          <div className="stat-num">6</div>
          <div className="stat-label">Projects shipped</div>
        </div>
        <div className="stat">
          <div className="stat-num">20+</div>
          <div className="stat-label">Component library</div>
        </div>
      </div>
    </>
  );
}

export default Hero;
