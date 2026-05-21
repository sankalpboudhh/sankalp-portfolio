import './index.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Contact />
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
        <p>Built with React.js</p>
      </footer>
    </>
  );
}

export default App;