import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// PERFORMANCE FIXES:
// 1. Removed animate={{ width, height }} — these trigger layout reflow every frame.
//    Replaced with transform: scale() which is GPU-composited (no layout/paint).
// 2. Removed mixBlendMode: "difference" — forces a compositor isolation layer on a
//    moving element, doubling GPU composite cost on every frame.
// 3. Added isHoveringRef so setIsHovering only fires when state actually CHANGES.
//    Previously it called setState on every mouseover event = React re-render on
//    every element the mouse crossed, even if hover state didn't change.
// 4. All colour/shape changes now use CSS transition (browser-native, off JS thread)
//    instead of Framer Motion's JS-driven spring for those properties.

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed,  setIsPressed]  = useState(false);
  const [isVisible,  setIsVisible]  = useState(false);
  const isTouch      = useRef(false);
  const isHoveringRef = useRef(false);   // prevents redundant setState calls
  const isPressedRef  = useRef(false);

  const dotX  = useMotionValue(0);
  const dotY  = useMotionValue(0);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 32, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    const styleTag = document.createElement("style");
    styleTag.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleTag);

    const handleMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const shouldHover = !!(
        target.tagName === "BUTTON" ||
        target.tagName === "A"      ||
        target.closest("button")   ||
        target.closest("a")        ||
        target.closest("[data-cursor-hover]")
      );
      // KEY FIX: only trigger re-render when value actually changes
      // Previously this ran setIsHovering on EVERY mouseover event
      if (shouldHover !== isHoveringRef.current) {
        isHoveringRef.current = shouldHover;
        setIsHovering(shouldHover);
      }
    };

    const handleMouseDown = () => {
      if (!isPressedRef.current) { isPressedRef.current = true; setIsPressed(true); }
    };
    const handleMouseUp = () => {
      if (isPressedRef.current) { isPressedRef.current = false; setIsPressed(false); }
    };
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove",  handleMouseMove,  { passive: true });
    window.addEventListener("mouseover",  handleMouseOver,  { passive: true });
    window.addEventListener("mousedown",  handleMouseDown,  { passive: true });
    window.addEventListener("mouseup",    handleMouseUp,    { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove",  handleMouseMove);
      window.removeEventListener("mouseover",  handleMouseOver);
      window.removeEventListener("mousedown",  handleMouseDown);
      window.removeEventListener("mouseup",    handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      styleTag.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isTouch.current) return null;

  return (
    <>
      {/* ── Instant dot ── no spring, no lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden lg:block"
        style={{
          x:       dotX,
          y:       dotY,
          opacity: isVisible ? 1 : 0,
          willChange: 'transform',
        }}
        animate={{ scale: isHovering ? 0 : isPressed ? 1.6 : 1 }}
        transition={{ scale: { duration: 0.15 } }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width:      6,
            height:     6,
            background: "var(--accent-primary, #3B82F6)",
            boxShadow:  "0 0 8px var(--accent-primary, #3B82F6)",
          }}
        />
      </motion.div>

      {/* ── Trailing ring ── spring position only; CSS transitions handle shape */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden lg:block"
        style={{
          x:          ringX,
          y:          ringY,
          opacity:    isVisible ? 1 : 0,
          willChange: 'transform',
          // REMOVED: mixBlendMode — was forcing a full compositor layer on every frame
        }}
      >
        {/*
          KEY FIX: No animate prop here.
          width/height/color changes now use CSS transition via the style prop.
          transform: scale() replaces width/height animation — scale is GPU-composited
          and causes ZERO layout recalculation, unlike width/height which reflow the page.
        */}
        <div
          className="-translate-x-1/2 -translate-y-1/2"
          style={{
            width:           32,
            height:          32,
            borderRadius:    isHovering ? 12 : 9999,
            backgroundColor: isHovering ? "rgba(255,255,255,0.88)" : "transparent",
            border:          `1px solid ${isHovering ? "transparent" : "rgba(99,102,241,0.5)"}`,
            transform:       `scale(${isHovering ? 1.75 : isPressed ? 0.82 : 1})`,
            // CSS transition — runs on browser compositor, not JS thread
            transition: [
              "transform 0.18s ease",
              "background-color 0.14s ease",
              "border-color 0.14s ease",
              "border-radius 0.18s ease",
            ].join(", "),
          }}
        />
      </motion.div>
    </>
  );
}