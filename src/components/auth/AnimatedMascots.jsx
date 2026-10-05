import { useEffect, useRef, useState } from 'react';

/**
 * Animated mascots for the login / register screens.
 *
 * Props
 *  focused         true while an input is focused / being typed in -> they look at the form
 *  passwordVisible true while the password is revealed -> they look away, orange shuts its eyes
 *  submitHover     true while the pointer is over the submit button -> worried faces
 *  error           true after a failed submit -> sad faces + shake
 *  success         true after a successful submit -> happy faces + hop
 *
 * Put it inside the left panel: the component treats its parent element as the
 * "mascot panel" (pointer over the panel = happy face).
 */

const BASE = 240; // y of the floor inside the viewBox
const INK = '#16161a';
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const START = { lx: 0, ly: 0, leanP: 0, stretchP: 1, leanB: 0, leanY: 0 };

// Lean a shape sideways around the floor line (top moves by `lean`, feet stay put)
const skew = (lean, height) =>
  `translate(0 ${BASE}) skewX(${(-Math.atan2(lean, height) * 180) / Math.PI}) translate(0 ${-BASE})`;

function Eye({ cx, cy, r, pr, lx, ly, closed }) {
  if (closed) {
    return (
      <path
        d={`M${cx - r} ${cy} Q${cx} ${cy - r * 1.4} ${cx + r} ${cy}`}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  const m = r - pr - 0.6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" />
      <circle cx={cx + lx * m} cy={cy + ly * m} r={pr} fill={INK} />
    </g>
  );
}

// Each piece: outer group = entrance drop, middle = success hop, inner = lean (set by caller)
function Piece({ delay, rot, hop, hopDelay, children }) {
  return (
    <g className="m-piece" style={{ '--d': `${delay}s`, '--r': `${rot}deg` }}>
      <g className={hop ? 'm-hop' : ''} style={{ animationDelay: `${hopDelay}s` }}>
        {children}
      </g>
    </g>
  );
}

export default function AnimatedMascots({
  focused = false,
  passwordVisible = false,
  submitHover = false,
  error = false,
  success = false,
  className = '',
}) {
  const wrap = useRef(null);
  const pointer = useRef({ x: null, y: null });
  const cur = useRef({ ...START });
  const live = useRef({});
  const [f, setF] = useState(START);
  const [hovered, setHovered] = useState(false);

  const mood = success
    ? 'happy'
    : error || submitHover
    ? 'sad'
    : passwordVisible
    ? 'shy'
    : hovered
    ? 'happy'
    : 'neutral';

  live.current = { mood, focused };

  // Track the pointer (and whether it is over the mascot panel)
  useEffect(() => {
    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      const r = wrap.current?.parentElement?.getBoundingClientRect();
      if (r) {
        setHovered(
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
        );
      }
    };
    const onLeave = () => setHovered(false);
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Spring-ish smoothing loop
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = performance.now();

    const computeTarget = () => {
      const { mood: m, focused: foc } = live.current;
      let lx = 0;
      let ly = 0;
      const p = pointer.current;
      const el = wrap.current;
      if (el && p.x != null) {
        const r = el.getBoundingClientRect();
        lx = clamp((p.x - (r.left + r.width / 2)) / 420, -1, 1);
        ly = clamp((p.y - (r.top + r.height / 2)) / 320, -1, 1);
      }
      if (m === 'shy') return { lx: -0.9, ly: 0.5, leanP: -14, stretchP: 0.94, leanB: -6, leanY: -5 };
      if (m === 'sad') return { lx: 0.4, ly: 0.8, leanP: -32, stretchP: 0.9, leanB: -4, leanY: 0 };
      if (foc) {
        lx = 0.9;
        ly = 0.3;
      }
      return {
        lx,
        ly,
        leanP: lx * 30,
        stretchP: 1 + Math.abs(lx) * 0.07 + Math.max(0, -ly) * 0.05,
        leanB: lx * 9,
        leanY: lx * 6,
      };
    };

    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 9);
      const c = cur.current;
      const g = computeTarget();
      let moving = false;
      for (const key in g) {
        const d = g[key] - c[key];
        if (Math.abs(d) > 0.0005) {
          c[key] += d * k;
          moving = true;
        }
      }
      if (moving) setF({ ...c });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- geometry derived from the smoothed values ---------- */
  const { lx, ly } = f;

  // Purple: curved, leaning, stretchy
  const PH = 224 * f.stretchP;
  const pTop = BASE - PH;
  const pTilt = f.leanP * 0.12;
  const pL = [87 + f.leanP, pTop + pTilt];
  const pR = [191 + f.leanP, pTop - pTilt];
  const purplePath =
    `M87 ${BASE} C87 ${BASE - PH * 0.5} ${87 + f.leanP * 0.45} ${BASE - PH * 0.8} ${pL[0]} ${pL[1]} ` +
    `L${pR[0]} ${pR[1]} C${191 + f.leanP * 0.45} ${BASE - PH * 0.8} 191 ${BASE - PH * 0.5} 191 ${BASE} Z`;
  const pfx = 154 + f.leanP * 0.92 + lx * 5;
  const pfy = pTop + 36 + ly * 5;

  // Orange face
  const ox = 141 + lx * 10;
  const oy = 182 + ly * 6;

  // Yellow face: eye + a long "mouth" line that swings toward the pointer
  const yEyeX = 244 + lx * 10;
  const dirX = clamp(lx * 2.5, -1, 1);
  const mSx = yEyeX + 14 * dirX;
  const mSy = 152;
  const mEx = mSx + 40 * dirX;
  const mEy = mSy + 20 * clamp(ly, -0.7, 0.7);

  const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinecap: 'round', fill: 'none' };

  return (
    <div ref={wrap} className={`w-full max-w-[460px] select-none pointer-events-none ${className}`}>
      <style>{`
        @keyframes m-drop {
          0%   { transform: translateY(-340px) rotate(var(--r)); opacity: 0; }
          8%   { opacity: 1; }
          58%  { transform: translateY(0) rotate(0); }
          72%  { transform: translateY(-16px); }
          86%  { transform: translateY(0); }
          93%  { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        @keyframes m-hop {
          0%, 100% { transform: translateY(0); }
          35% { transform: translateY(-26px); }
          65% { transform: translateY(0); }
          80% { transform: translateY(-8px); }
        }
        @keyframes m-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        .m-piece { transform-box: fill-box; transform-origin: 50% 100%;
                   animation: m-drop 1.1s cubic-bezier(.3,.7,.4,1) both; animation-delay: var(--d); }
        .m-hop   { transform-box: fill-box; transform-origin: 50% 100%; animation: m-hop .7s ease-in-out 2; }
        .m-shake { animation: m-shake .45s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .m-piece, .m-hop, .m-shake { animation: none; }
        }
      `}</style>

      <svg viewBox="0 0 320 250" className={`w-full overflow-visible ${error ? 'm-shake' : ''}`} fill="none">
        {/* ---------- Purple ---------- */}
        <Piece delay={0.05} rot={-35} hop={success} hopDelay={0.1}>
          <path d={purplePath} fill="#5A22F7" />
          <g transform={`rotate(${f.leanP * 0.25} ${pfx} ${pfy})`}>
            <Eye cx={pfx - 11} cy={pfy} r={4} pr={1.9} lx={lx} ly={ly} />
            <Eye cx={pfx + 11} cy={pfy} r={4} pr={1.9} lx={lx} ly={ly} />
            {mood === 'neutral' && <line x1={pfx} y1={pfy + 4} x2={pfx} y2={pfy + 18} {...stroke} />}
            {mood === 'happy' && (
              <path d={`M${pfx - 7} ${pfy + 10} Q${pfx} ${pfy + 18} ${pfx + 7} ${pfy + 10}`} {...stroke} />
            )}
            {(mood === 'sad' || mood === 'shy') && (
              <path d={`M${pfx - 7} ${pfy + 15} Q${pfx} ${pfy + 7} ${pfx + 7} ${pfy + 15}`} {...stroke} />
            )}
          </g>
        </Piece>

        {/* ---------- Orange dome ---------- */}
        <Piece delay={0.2} rot={20} hop={success} hopDelay={0.18}>
          <path d="M20 240 A88 92 0 0 1 196 240 Z" fill="#FF7A2A" />
          {mood === 'shy' ? (
            <>
              <Eye cx={ox - 19} cy={oy - 1} r={5} closed />
              <Eye cx={ox + 19} cy={oy - 4} r={5} closed />
            </>
          ) : (
            <>
              <circle cx={ox - 19} cy={oy - 1} r="3.6" fill={INK} />
              <circle cx={ox + 19} cy={oy - 4} r="3.6" fill={INK} />
            </>
          )}
          {mood === 'happy' ? (
            <path d={`M${ox - 8} ${oy + 8} Q${ox} ${oy + 22} ${ox + 8} ${oy + 8} Z`} fill={INK} />
          ) : mood === 'sad' ? (
            <path d={`M${ox - 7} ${oy + 16} Q${ox} ${oy + 8} ${ox + 7} ${oy + 16}`} {...stroke} />
          ) : (
            <circle cx={ox} cy={oy + 10} r="3.2" fill={INK} />
          )}
        </Piece>

        {/* ---------- Black ---------- */}
        <Piece delay={0.12} rot={30} hop={success} hopDelay={0.26}>
          <g transform={skew(f.leanB, 160)}>
            <rect x="162" y={BASE - 160} width="62" height="160" fill="#1B1B20" />
            <Eye cx={184 + lx * 3} cy={BASE - 136 + ly * 2} r={5.2} pr={2.3} lx={lx} ly={ly} />
            <Eye cx={202 + lx * 3} cy={BASE - 136 + ly * 2} r={5.2} pr={2.3} lx={lx} ly={ly} />
          </g>
        </Piece>

        {/* ---------- Yellow ---------- */}
        <Piece delay={0.28} rot={-25} hop={success} hopDelay={0.34}>
          <g transform={skew(f.leanY, 116)}>
            <path d="M210 240 V160 A36 36 0 0 1 282 160 V240 Z" fill="#E8C51B" />
            <circle cx={yEyeX} cy="140" r="3.2" fill={INK} />
            {mood === 'sad' ? (
              <path
                d={`M${mSx} ${mSy} q6 -6 12 0 t12 0 t12 0`}
                transform={dirX < 0 ? `scale(-1 1) translate(${-2 * mSx} 0)` : undefined}
                {...stroke}
              />
            ) : (
              <line x1={mSx} y1={mSy} x2={mEx} y2={mEy} {...stroke} />
            )}
          </g>
        </Piece>
      </svg>
    </div>
  );
}