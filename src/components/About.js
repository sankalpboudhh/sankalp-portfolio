import { useEffect,useRef, useState } from "react";
import "./About.css";
import { ReactComponent as ReactIcon } from "../assets/reactimg.svg";
import { ReactComponent as JSIcon } from "../assets/javascript.svg";
import { ReactComponent as BootstrapIcon } from "../assets/bootstrap.svg";
import { ReactComponent as MuiIcon } from "../assets/material-ui.svg";
import { ReactComponent as ReduxIcon } from "../assets/redux.svg";
import { ReactComponent as JspIcon } from "../assets/jsp.svg";
import { ReactComponent as NodeIcon } from "../assets/nodejs.svg";
// import { ReactComponent as ExpressIcon } from "../assets/express-js.png";
import { ReactComponent as MongoIcon } from "../assets/mongodb.svg";

import { Stat } from "./utils";

const MODES = {
  developer: {
    label: "Developer.",
    body: [
      <>I'm a frontend developer with <b>4+ years building enterprise web applications</b> — primarily in React.js, Javascript, and JSP. Currently at Izmo Ltd., where I've built UI modules used across 800+ car dealerships globally.</>,
      <>I care about <b>clean component architecture, performance, and interfaces that feel effortless</b>.</>,
    ],
    stats: [
      { n: 4, suffix: "+", label: "years shipping" },
      { n: 800, suffix: "+", label: "dealerships" },
    ],
  },
  founder: {
    label: "Ex-founder.",
    body: [
      <>Before that, I ran <b>Dosa Fusion</b> — a food business I scaled from a roadside stall to 3 outlets with 20+ staff.</>,
      <>That taught me about <b>ownership, leadership, and building things from scratch</b>.</>,
    ],
    stats: [
      { n: 3, suffix: "", label: "outlets" },
      { n: 20, suffix: "+", label: "staff" },
    ],
  },
};

// Edit the notes to whatever you want visitors to see.
const SKILLS = [
  { name: "React.js", level: 90, icons: [ReactIcon], note: "Inventory widget, header versions, model selectors, floating menu link — live on 800+ dealership sites." },
  { name: "JavaScript (ES6+)", icons: [JSIcon], level: 88, note: "Scroll-following menus, hover interactions, and the glue behind every widget." },
  { name: "Material UI + Bootstrap", icons: [MuiIcon, BootstrapIcon], level: 85, note: "Fast, consistent UI across the dealership platform and personal projects." },
  { name: "Redux", level: 80,icons:[ReduxIcon], note: "Predictable state for multi-version enterprise UI modules." },
  { name: "JSP", level: 75,icons:[JspIcon], note: "Rebuilt React widgets to match the existing JSP inventory widgets, pixel for pixel." },
  { name: "Node.js + Express",icons:[NodeIcon], level: 72, note: "Backend side of the Crio.Do full-stack projects (QKart, XFlix, QTrip, XBoard)." },
  { name: "MongoDB", level: 65,icons:[MongoIcon], note: "Data layer for the full-stack projects." },
];



export default function AboutInteractive() {
  const [mode, setMode] = useState("developer");
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.25 }
    );
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const m = MODES[mode];

  return (
    <section className="about" ref={ref}>
      <div className="about-eyebrow"><span /> ABOUT ME</div>

      <h2 className="about-title">
        {Object.entries(MODES).map(([key, v]) => (
          <button
            key={key}
            className={`about-toggle ${mode === key ? "on" : ""}`}
            onClick={() => setMode(key)}
            onMouseEnter={() => setMode(key)}
          >
            {v.label}
          </button>
        ))}
      </h2>
      <p className="about-hint">↑ hover or tap a word</p>

      <div className="about-grid">
        <div className="about-story" key={mode}>
          {m.body.map((p, i) => <p key={i}>{p}</p>)}
          <div className="about-stats">
            {m.stats.map((s) => <Stat key={s.label} {...s} k={mode} />)}
          </div>
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

        <div className="about-skills">
          <div className="about-skill-blocks">
            {SKILLS.map((s, i) => (
              <div
                key={s.name}
                className={`about-skill-block ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <div className="about-row">
                  {s.icons && (
                    <span className="about-skill-icons">
                      {s.icons.map((Icon, idx) => (
                        <Icon key={idx} className="about-skill-icon" aria-hidden="true" />
                      ))}
                    </span>
                  )}
                  <span>{s.name}</span>
                </div>
                
              </div>
            ))}
          </div>
          <div className="about-note" key={active}>
            <span className="about-prompt">&gt;</span> {SKILLS[active].note}
            <span className="about-cursor" />
          </div>
        </div>
      </div>
    </section>
  );
}