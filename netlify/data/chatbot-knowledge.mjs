// Public-safe knowledge for the portfolio AI assistant (server-side only).
// Sources: src/components/{Hero,About,Contact}.js, src/data/projects.js,
// public/Sankalp_Boudhh_Resume.pdf (latest) and public/Sankalp_Boudhh_Resume1.pdf.
// Where the resumes differ, numbers come from the latest resume.
// Lives outside src/ so it is never bundled into the public React build.

const knowledge = {
  profile: {
    name: "Sankalp Boudhh",
    headline: "Frontend Developer · React.js · UI Engineering",
    location: "Bengaluru, India",
    currentRole: "Software Engineer - UI Developer at Izmo Ltd., Bengaluru (since Dec 2022; promoted from Associate Software Engineer in Apr 2026)",
    availability: "Open to frontend and full-stack developer roles, in Bengaluru or remote.",
    highlights: [
      "4 years of frontend experience",
      "UI modules used across 800+ car dealerships",
      "Built a reusable component library of 20+ UI elements",
      "6 portfolio projects shipped",
      "Ex-founder of Dosa Fusion, a food business scaled from a roadside stall to 3 outlets",
    ],
  },

  professionalSummary:
    "Frontend Developer with 4 years of experience building responsive, high-performance web applications for enterprise clients. Proficient in React.js, JavaScript, Redux, and REST API integration. Track record of delivering reusable component libraries and UI performance improvements in production. Former founder with an ownership mindset — able to lead, ship, and iterate fast. Cares about clean component architecture, performance, and interfaces that feel effortless.",

  contact: {
    email: "sankalpboudhh@gmail.com",
    phone: "+91 9039 217 667",
    linkedin: "https://www.linkedin.com/in/sankalp-boudhh/",
    github: "https://github.com/sankalpboudhh",
    portfolio: "https://sankalpboudhh.netlify.app/",
    resume: "https://sankalpboudhh.netlify.app/Sankalp_Boudhh_Resume.pdf",
    crioPortfolio: "https://www.crio.do/learn/portfolio/sankalpboudhh/",
  },

  skills: {
    core: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "JSP"],
    stateAndStyling: ["Redux", "Bootstrap", "Material UI", "Responsive Design"],
    backendAndApis: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Authentication"],
    toolsAndPractices: ["Git", "Postman", "Agile", "Code Review", "Reusable Component Architecture"],
    other: ["Python", "Linux", "Windows"],
    howUsed: {
      "React.js": "Inventory widget, header versions, model selectors, floating menu link — live on 800+ dealership sites.",
      JavaScript: "Scroll-following menus, hover interactions, and the glue behind every widget.",
      Bootstrap: "Fast, consistent UI across the dealership platform and personal projects.",
      "Material UI": "Consistent UI across personal projects.",
      Redux: "Predictable state for multi-version enterprise UI modules.",
      JSP: "Rebuilt React widgets to match the existing JSP inventory widgets, pixel for pixel.",
      "Node.js / Express": "Backend side of the Crio.Do full-stack projects (QKart, XFlix, QTrip, XBoard).",
      MongoDB: "Data layer for the full-stack projects.",
    },
  },

  experience: [
    {
      role: "Software Engineer – UI Developer",
      company: "Izmo Ltd.",
      location: "Bengaluru",
      dates: "Dec 2022 – Present",
      note: "Promoted from Associate Software Engineer in Apr 2026.",
      points: [
        "Engineered and maintained responsive UI modules for an enterprise car dealership platform, supporting inventory management and appointment scheduling workflows used across 800+ dealerships.",
        "Migrated 15+ legacy JSP views to modular React.js components, reducing code duplication by 40% and cutting cross-team feature delivery time by 25%.",
        "Developed a reusable component library of 20+ UI elements, cutting development time for new features by 30%.",
        "Optimized 3+ critical frontend modules, reducing inventory list render time by 35% and improving page load performance for 800+ dealership users.",
        "Collaborated with a 4-member backend team on 10+ REST API integrations, resolving data-flow bottlenecks that improved response times by 20% in high-traffic dealership modules.",
        "Point of contact for migration processes.",
        "Handles quick-fix requests from other teams, including Support, Design, and Marcom.",
      ],
    },
    {
      role: "Fellowship & Software Development Trainee",
      company: "Crio.Do",
      location: "Bengaluru",
      dates: "Aug 2021 – Dec 2022",
      points: [
        "Intensive full-stack fellowship program.",
        "Delivered production-grade projects including QKart, QTrip, and XBoard.",
        "Applied Git workflow, unit testing, API-based development, and agile sprint cycles throughout.",
      ],
    },
    {
      role: "Self-directed learning · Career transition",
      location: "Bengaluru",
      dates: "Jul 2020 – Aug 2021",
      points: [
        "Relocated to Bengaluru after closing Dosa Fusion and taught himself programming from online resources, starting with Python and completing the Python for Everybody certification.",
      ],
    },
    {
      role: "Founder & Head Operator",
      company: "Dosa Fusion",
      location: "Bhopal",
      dates: "Feb 2015 – Mar 2020",
      points: [
        "Researched recipes and learned to cook through 2014–15 before launching in Feb 2015.",
        "Scaled a bootstrapped food business from a roadside stall to 3 outlets with a team of 20+.",
        "All outlets were in Bhopal.",
        "Won 'Best Breakfast in Bhopal' by Zomato (2019) and 'Hawker of the Day' by Institute of Hotel Management.",
        "Established operational processes, managed hiring, and drove consistent revenue growth across the outlets.",
        "Closed operations in Mar 2020 due to the COVID-19 lockdown and wound down the business by Jul 2020.",
      ],
      photoAlbumAndMediaCoverage: "https://photos.google.com/share/AF1QipNjY-moMAhXL3zK231Eu_mJZwExxfB6laKJSPqkvnOm_zLnjV8P1C6TFM-PHk61Zg?key=d3VGQ3dvb2U4RXUwdDNWTDFNcEsxT25aZks1T1hR",
      outlets: [
        {
          name: "Shahpura Eat Street (the first outlet)",
          story: "Where it started — the first brick: a roadside stall open in the evenings, roughly 4 pm to 10–11 pm.",
          googleMaps: "https://maps.app.goo.gl/oDFVksRXt8QKP8EcA",
        },
        {
          name: "Rohit Nagar",
          details: "A 2,100 sq ft outlet with 40-person seating, available on Zomato, Swiggy, and Uber Eats (before Uber Eats India was acquired by Zomato).",
          googleMaps: "https://maps.app.goo.gl/4PxzzdsMZmazPRNE6",
        },
      ],
      whyItMatters: "A key differentiator: running Dosa Fusion taught him ownership, leadership, hiring, and building things from scratch — the same mindset he brings to shipping software.",
    },
  ],

  projects: [
    {
      name: "QKart",
      description: "Full e-commerce platform with product listing, debounced search, cart management, JWT auth, and complete checkout flow with address and wallet payment.",
      tech: ["React.js", "Node.js", "MongoDB", "JWT", "MUI"],
      live: "https://qkart-sankalp.netlify.app/",
      github: "https://github.com/sankalpboudhh/qkart-frontend-react",
    },
    {
      name: "XFlix",
      description: "YouTube-inspired video streaming platform with genre filtering, age ratings, debounced search, vote/view tracking, and a full Node.js REST API backend.",
      tech: ["React.js", "Node.js", "Express", "MongoDB", "Joi"],
      live: "https://sankalp-xflix.netlify.app/",
      github: "https://github.com/sankalpboudhh/xflix-react",
    },
    {
      name: "QTrip",
      description: "Multi-page travel booking app with city listing, adventure filtering, reservation flow, and filter persistence via localStorage.",
      tech: ["Vanilla JS", "Bootstrap", "Node.js", "LowDB", "REST API"],
      live: "https://sankalp-qtrip-dynamic.netlify.app/",
      github: "https://github.com/sankalpboudhh/qtrip-dynamic",
    },
    {
      name: "Auth System",
      description: "Full-stack MERN authentication with register, login, JWT token flow, Passport.js strategies, bcrypt password hashing, and Redux state management.",
      tech: ["React.js", "Redux", "Passport.js", "MongoDB", "JWT"],
      github: "https://github.com/sankalpboudhh/auth-system-mern",
    },
    {
      name: "NewsFeed",
      description: "React news reader with swipeable carousel, smart read/unread tracking, unread-first sorting, and persistent state via localStorage.",
      tech: ["React.js", "Context API", "Bootstrap", "localStorage"],
      live: "https://sparkling-chaja-b3c86f.netlify.app/",
      github: "https://github.com/sankalpboudhh/newsfeed-react",
    },
    {
      name: "Mojdi's",
      description: "React frontend for a fictional Indian sustainable footwear brand with product catalogue, accordion navigation, MUI modal, and responsive layout.",
      tech: ["React.js", "Bootstrap", "Material UI"],
      live: "https://mojdis.netlify.app/",
      github: "https://github.com/sankalpboudhh/mojdis",
    },
    {
      name: "XBoard",
      description: "Live news portal powered by RSS feed APIs with category filtering (Crio.Do fellowship project).",
      live: "https://xboard-sankalp.netlify.app/",
      note: "Minor learning project: do not feature it in project overviews; mention it only if asked about XBoard or Crio.Do projects specifically.",
    },
  ],

  education: [
    {
      degree: "B.E. in Computer Science",
      institution: "NRI Institute of Information Science & Technology, Bhopal",
      dates: "2010 – 2014",
      note: "Left before completing the degree to pursue entrepreneurship (Dosa Fusion).",
    },
  ],
  certifications: ["Python for Everybody — Coursera / University of Michigan"],
  languages: ["English — Full Professional Proficiency", "Hindi — Native / Bilingual Proficiency"],

  answerGuidance: [
    "The Dosa Fusion founder story is what makes Sankalp stand out. When asked about his background, what makes him different, leadership, ownership, or Dosa Fusion, highlight it and share the photo album / media coverage link.",
    "Share the outlet Google Maps links when asked where Dosa Fusion was or about its outlets.",
  ],

  thisPortfolio: "Built with React and Bootstrap, hosted on Netlify, with Netlify Functions for a visitor counter (Upstash Redis) and this AI assistant (Google Gemini). Supports light/dark themes and accent colours.",
};

export default knowledge;
