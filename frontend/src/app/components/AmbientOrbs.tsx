// FULLY STATIC — zero GPU cost.
// No blur filters, no animations, no will-change.
// Pure CSS radial gradients are rasterized once by the browser and cached.
// They never change (except the accent orb on level switch, which is a single CSS transition).

interface AmbientOrbsProps {
  accentColor?: string;
}

export function AmbientOrbs({ accentColor = '#3B82F6' }: AmbientOrbsProps) {
  return (
    <>
      {/* Three fixed gradient orbs — rendered once, never repainted */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 72% 12%, rgba(139,92,246,0.13) 0%, transparent 65%)',
            'radial-gradient(ellipse 55% 60% at 22% 78%, rgba(59,130,246,0.11) 0%, transparent 65%)',
            'radial-gradient(ellipse 45% 45% at 50% 52%, rgba(99,102,241,0.07) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
      {/* Accent orb — only this one changes, and only on level switch */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '28%', right: '28%',
          width: '22rem', height: '22rem',
          borderRadius: '9999px',
          // hex alpha: #color + '1A' = 10% opacity (e.g. #F973161A)
          background: `radial-gradient(circle, ${accentColor}1A 0%, transparent 65%)`,
          transition: 'background 1.5s ease',
        }}
      />
    </>
  );
}