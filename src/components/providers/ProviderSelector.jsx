import { useEffect, useRef, useState } from 'react';
import { STATUS_DOT, STATUS_LABEL, displayName } from './providerMeta';

const PROVIDERS = ['GROQ', 'GEMINI', 'OPENROUTER'];

const optionClass = (active) =>
  `flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold hover:bg-sidebar cursor-pointer select-none ${
    active ? 'bg-accent-wash' : ''
  }`;

export default function ProviderSelector({ selected, onChange, statuses = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const statusOf = (p) => statuses.find((s) => s.provider.toUpperCase() === p)?.status;
  const choose = (value) => {
    onChange(value);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative cursor-default select-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-line bg-sidebar py-1.5 pr-2.5 pl-2 text-[12.5px] font-semibold cursor-pointer select-none"
      >
        <span className="size-[7px] rounded-full bg-accent" />
        {selected === 'AUTO' ? 'Auto' : displayName(selected)}
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-60 rounded-xl border border-line bg-white dark:bg-sidebar p-1.5 shadow-lg cursor-default select-none">
          <button type="button" onClick={() => choose('AUTO')} className={optionClass(selected === 'AUTO')}>
            Auto
            <span className="text-[11.5px] font-medium text-muted">Picks the healthiest</span>
          </button>
          {PROVIDERS.map((p) => {
            const status = statusOf(p);
            return (
              <button key={p} type="button" onClick={() => choose(p)} className={optionClass(selected === p)}>
                <span className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${STATUS_DOT[status] ?? 'bg-muted'}`} />
                  {displayName(p)}
                </span>
                <span className="text-[11.5px] font-medium text-muted">{STATUS_LABEL[status] ?? ''}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}