import { Suspense, useEffect, useRef, useState } from "react";
import "./LazySection.css";

// Renders `children` (a React.lazy component) only once the placeholder is
// near the viewport, so its JS chunk is fetched on scroll. Fades up on mount.
// `id` is kept on the placeholder so nav anchor links work before it loads.
function LazySection({ id, minHeight = 500, rootMargin = "300px", children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver support: just load immediately.
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect(); // load once, never unmount
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const placeholder = <div id={id} className="lazy-placeholder" style={{ minHeight }} />;

  if (!show) return <div ref={ref}>{placeholder}</div>;

  return (
    <Suspense fallback={placeholder}>
      <div className="lazy-reveal">{children}</div>
    </Suspense>
  );
}

export default LazySection;
