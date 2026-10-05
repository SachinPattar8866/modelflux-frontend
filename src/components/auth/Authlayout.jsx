import AnimatedMascots from './AnimatedMascots';

/**
 * Two-panel shell: mascots on the left (hidden on small screens), form card on the right.
 * Add Poppins once in index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
 */
export default function AuthLayout({ mascotProps, title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen bg-[#E7E5EC] p-3 flex"
      style={{ fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Left: mascot panel (the mascots use this element as their hover area) */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-10">
        <AnimatedMascots {...mascotProps} />
      </div>

      {/* Right: form card */}
      <div className="flex-1 lg:flex-none lg:w-[46%] max-w-full bg-white rounded-[28px] flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-[340px] flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="text-3xl leading-none mb-5">✚</div>
            <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="text-xs text-neutral-500 mt-8">{footer}</div>
      </div>
    </div>
  );
}

/** Underline-style input with a small label, like the reference video. */
export function Field({ label, right, className = '', ...inputProps }) {
  return (
    <label className={`block mb-5 ${className}`}>
      <span className="block text-[11px] text-neutral-500 mb-1">{label}</span>
      <span className="flex items-center border-b border-neutral-300 focus-within:border-neutral-900 transition-colors">
        <input
          {...inputProps}
          className="w-full bg-transparent py-1.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
        {right}
      </span>
    </label>
  );
}

export function EyeToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      className="p-1 text-neutral-700 hover:text-black"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {visible ? (
          <>
            <path d="M3 3l18 18" />
            <path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-3.2 3.7M6.6 6.6A16.6 16.6 0 0 0 3 12s4 6 9 6c1.4 0 2.7-.3 3.9-.9" />
          </>
        ) : (
          <>
            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}

export const primaryBtn =
  'w-full rounded-full bg-neutral-900 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60';