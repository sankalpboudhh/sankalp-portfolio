import './index.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import LazySection from './components/LazySection';
import { lazy, useEffect } from 'react';
import ReactGA from "react-ga4";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'




const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/", title: "Portfolio Home" });
  }, []);
  

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="section-divider" />
        <LazySection id="about" minHeight={600}><About /></LazySection>
        <div className="section-divider" />
        <LazySection id="projects" minHeight={700}><Projects /></LazySection>
        <div className="section-divider" />
        <LazySection id="contact" minHeight={400}><Contact /></LazySection>
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        fontSize: '12px',
        color: 'var(--muted)'
      }}>
        <p>© 2026 <span style={{ color: 'var(--accent)' }}>Sankalp Boudhh</span></p>
        <p>Designed & Developed by <span style={{ color: 'var(--accent)' }}>Sankalp </span>
        <FontAwesomeIcon style={{ color: 'red' }} icon={faHeart} />
        </p>
      </footer>
    </>
  );
}

export default App;