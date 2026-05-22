import './Contact.css';

const links = [
  { label: 'Email', value: 'sankalpboudhh@gmail.com', href: 'mailto:sankalpboudhh@gmail.com' },
  { label: 'LinkedIn', value: 'in/sankalp-boudhh', href: 'https://linkedin.com/in/sankalp-boudhh' },
  { label: 'GitHub', value: 'sankalpboudhh', href: 'https://github.com/sankalpboudhh' },
];

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-label">Get in touch</div>
      <h2 className="contact-heading">Let's work<br />together.</h2>
      <div className="contact-grid">
        <p className="contact-text">
          I'm currently open to frontend and full-stack developer roles —
          in Bengaluru or remote. If you're building something
          interesting, I'd love to hear about it.
        </p>
        <div className="contact-links">
          {links.map((l) => (
            <a href={l.href} className="contact-item" key={l.label} target="_blank" rel="noreferrer">
              <div>
                <div className="contact-item-label">{l.label}</div>
                <div className="contact-item-value">{l.value}</div>
              </div>
              <span className="contact-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;