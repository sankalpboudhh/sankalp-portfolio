import { useEffect, useRef, useState } from "react";

// true while the referenced element is in the viewport; flips back to false when it leaves
export function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold }
    );
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function useCountUp(target, key, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    let raf;
    const start = performance.now();
    const dur = 1000;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, key, active]);
  return val;
}

export function Stat({ n, suffix = "", label, k, className = "about-stat", 
  numClass = "about-stat-n", labelClass = "about-stat-l" }) {
  const [ref, inView] = useInView();
  const v = useCountUp(n, k, inView);
  return (
    <div className={className} ref={ref}>
      <div className={numClass}>{v}{suffix}</div>
      <div className={labelClass}>{label}</div>
    </div>
  );
}