import projects from '../data/projects';
import './Projects.css';
import ReactGA from "react-ga4";


const handleProjectClick = (projectName) => {
  ReactGA.event({
    category: "Project",
    action: "Click",
    label: projectName,
  });
};
const handleGithubClick = (projectName) => {
  ReactGA.event({
    category: "Project",
    action: "GitHub Click",
    label: projectName,
  });
};

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-label">Selected work</div>
      <h2 className="projects-heading">Things I've<br />shipped.</h2>
      <div className="projects-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.num}>
            <div className="project-num">{p.num} / {String(projects.length).padStart(2, '0')}</div>
            <div className="project-name">{p.name}</div>
            <p className="project-desc">{p.desc}</p>
            <div className="project-tags">
              {p.tags.map((t) => (
                <span className="project-tag" key={t}>{t}</span>
              ))}
            </div>
            <div className="project-links">
              {p.live && (
                <a href={p.live} onClick={() => handleProjectClick(p.name)} target="_blank" rel="noreferrer" className="project-link">
                  Live demo →
                </a>
              )}
              <a href={p.github} onClick={() => handleGithubClick(p.name)} target="_blank" rel="noreferrer" className="project-link">
                GitHub →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;