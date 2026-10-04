import { STATUS_DOT, STATUS_LABEL, displayName } from './providerMeta';

function tooltip(s) {
  if (s.status === 'RATE_LIMITED' && s.resetInSeconds) {
    return `Rate limited. Resets in ${s.resetInSeconds}s`;
  }
  return STATUS_LABEL[s.status] ?? s.status;
}

export default function ProviderStatusBar({ statuses }) {
  return (
    // FIX: Added cursor-default and select-none to lock down the entire top bar
    <div className="flex items-center gap-2 border-b border-line px-7 py-3.5 cursor-default select-none">
      {statuses.map((s) => (
        <span
          key={s.provider}
          title={tooltip(s)}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-soft"
        >
          <span className={`size-1.5 rounded-full ${STATUS_DOT[s.status] ?? 'bg-muted'}`} />
          {displayName(s.provider)}
          {s.status === 'RATE_LIMITED' && s.resetInSeconds ? (
            <span className="font-medium text-muted">{s.resetInSeconds}s</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}