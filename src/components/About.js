import './About.css';

const skills = [
  { label: 'React.js', level: 90 },
  { label: 'JavaScript (ES6+)', level: 88 },
  { label: 'Material UI + Bootstrap', level: 85 },
  { label: 'Redux', level: 80 },
  { label: 'JSP', level: 75 },
  { label: 'Node.js + Express', level: 72 },
  { label: 'MongoDB', level: 65 },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="section-label">About me</div>
      <h2 className="about-heading">Developer.<br />Ex-founder.</h2>
      <div className="about-grid">
        <div className="about-text">
          <p>
            I'm a frontend developer with <strong>3+ years building enterprise
            web applications</strong> — primarily in React.js, Redux, and JSP.
            Currently at Izmo Ltd., where I've built UI modules used across
            100+ car dealerships across India.
          </p>
          <p>
            Before that, I ran <strong>Dosa Fusion</strong> — a food business
            I scaled from a roadside stall to 3 outlets with 20+ staff. That
            taught me how to ship fast, own outcomes, and build things people
            actually use.
          </p>
          <p>
            I care about <strong>clean component architecture, performance,
            and interfaces that feel effortless</strong>. Currently open to
            frontend and full-stack roles in Bengaluru or remote.
          </p>
          <div className="about-links">
            <a
              href="https://github.com/sankalpboudhh"
              target="_blank"
              rel="noreferrer"
              className="about-link"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/sankalp-boudhh"
              target="_blank"
              rel="noreferrer"
              className="about-link"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://www.crio.do/learn/portfolio/sankalpboudhh/"
              target="_blank"
              rel="noreferrer"
              className="about-link"
            >
              Crio Portfolio ↗
            </a>
          </div>
        </div>
        <div className="skills-list">
          {skills.map((s) => (
            <div className="skill-row" key={s.label}>
              <div className="skill-meta">
                <span>{s.label}</span>
                <span>{s.level}%</span>
              </div>
              <div className="skill-track">
                <div className="skill-fill" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;