const PROVIDERS = ['AUTO', 'GROQ', 'GEMINI', 'OPENROUTER'];

export default function ProviderSelector({ selected, onChange }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 text-sm"
    >
      {PROVIDERS.map((p) => (
        <option key={p} value={p}>
          {p === 'AUTO' ? 'Auto (recommended)' : p}
        </option>
      ))}
    </select>
  );
}